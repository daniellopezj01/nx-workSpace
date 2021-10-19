const DB_URL = process.env.MONGO_URI
const { MONGO_TEST } = process.env
const mongoose = require('mongoose')

const loadModels = require('../app/models')

const dbType = process.env.NODE_ENV !== 'test' ? DB_URL : MONGO_TEST

const optionsConnection = {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}

module.exports = () => {
  try {
    const connect = () => {
      mongoose.Promise = global.Promise
      mongoose.connect(dbType, optionsConnection, (err) => {
        let dbStatus = ''
        if (err) {
          dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`
        }
        dbStatus = '*    DB Connection: OK\n****************************\n'
        // if (process.env.NODE_ENV) {
        // Prints initialization
        console.log('****************************')
        console.log('*    Starting Server')
        console.log(`*    Port: ${process.env.PORT || 3000}`)
        console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`)
        console.log('*    Database: MongoDB')
        console.log(dbStatus)
        // }
      })
      mongoose.set('useCreateIndex', true)
      mongoose.set('useFindAndModify', false)
    }
    connect()

    mongoose.connection.on('error', console.log)
    mongoose.connection.on('disconnected', connect)

    loadModels()
  } catch (error) {
    console.log('connect mongo', error.message)
  }
}
