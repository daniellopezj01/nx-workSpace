const helmet = require('helmet')
const express = require('express')
const passport = require('passport')
const app = express()
const fileUpload = require('express-fileupload')
const initMongo = require('./config/mongo')
const bodyParser = require('body-parser')

require('./app/plugins/index')
require('./app/services/hookService')
const server = require('http').createServer(app)
// process.env.NODE_ENV = 'test'
const i18n = require('i18n')
// for parsing json-
// Init all other stuff
// i18n
i18n.configure({
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true
})
app.use(i18n.init)

app.use(fileUpload())
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

app.use(helmet())
app.set('view engine', 'html')
app.use(passport.initialize())

app.use('/api/1.0', require('./app/routesApi'))
app.use('/admin', require('./app/routesAdmin'))

server.listen(process.env.PORT)
// Init MongoDB
initMongo()

module.exports = app // for testing
