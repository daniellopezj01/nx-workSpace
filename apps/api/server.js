const helmet = require('helmet')
require('dotenv-safe').config()
const express = require('express')
const cors = require('cors')
const morganBody = require('morgan-body')
const passport = require('passport')
const compression = require('compression')
const bodyParser = require('body-parser')

const app = express()
const i18n = require('i18n')
const morgan = require('morgan')
const path = require('path')
const server = require('http').createServer(app)
const fileUpload = require('express-fileupload')
const initMongo = require('./config/mongo')
const io = require('socket.io')(server)
const socket = require('./app/services/socket.service')
const { loggerSlack } = require('./config/logger')
const { callCrons } = require('./app/services/cronService')

require('./app/plugins/index')
require('./app/services/hookService')

require('./swagger-options')(app)

socket.init(io)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// Setup express server port from ENV, default: 3000
// app.set('port', process.env.PORT || 3000)

// Redis cache enabled by env variable

// for parsing json-
app.use(
  bodyParser.json({
    limit: '80mb'
  })
)
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '80mb',
    extended: true
  })
)

morganBody(app, {
  skip(req, res) {
    return (
      [403, 404, 409, 401, 422].includes(res.statusCode) || res.statusCode < 400
    )
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

// Init all other stuff
app.use(cors())
app.set('trust proxy', 1) // trust first proxy
app.use(fileUpload())
app.use(passport.initialize())
app.use(compression())
app.use(helmet())
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)

app.set('view engine', 'html')

app.use('/api/1.0', require('./app/routesApi'))
app.use('/admin', require('./app/routesAdmin'))
// app.use('/', require('./app/routes/tests'))
// var testRoutes = require('./app/routes/tests');

// require('./app/routes/tests')(app);
// app.use('/', require('./app/routes'))

server.listen(process.env.PORT)

// Init MongoDB
initMongo()

// Ejecutar los Cron
callCrons()

module.exports = app // for testing
