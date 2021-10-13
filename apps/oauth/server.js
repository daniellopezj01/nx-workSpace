require('dotenv-safe').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morganBody = require('morgan-body')
const hbs = require('hbs')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')

const app = express()
const i18n = require('i18n')
const path = require('path')
const initMongo = require('./config/mongo')
const { loggerSlack } = require('./config/logger')
require('./app/service/hooks')

// Setup express server port from ENV, default: 3000
app.set('port', process.env.PORT || 3000)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// Redis cache enabled by env variable
if (process.env.USE_REDIS === 'true') {
  const getExpeditiousCache = require('express-expeditious')
  const cache = getExpeditiousCache({
    namespace: 'expresscache',
    defaultTtl: '1 minute',
    engine: require('expeditious-engine-redis')({
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    })
  })
  app.use(cache)
}

// for parsing json
app.use(
  bodyParser.json({
    limit: '20mb'
  })
)
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true
  })
)

morganBody(app, {
  skip(req, res) {
    return [403, 404, 409].includes(res.statusCode) || res.statusCode < 400
  },
  stream: loggerSlack
})

// i18n
i18n.configure({
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true
})
app.use(i18n.init)

app.set('view engine', 'hbs')

// Init all other stuff
app.use(cors())
app.use(passport.initialize())
app.use(compression())
app.use(helmet())
app.use(cookieParser())
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)

app.set('view engine', 'html')
app.use(require('./app/routes'))

app.listen(app.get('port'))

// Init MongoDB
initMongo()

module.exports = app // for testing
