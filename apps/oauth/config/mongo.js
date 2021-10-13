const mongoose = require('mongoose')

const { MONGO_URI_TEST, MONGO_URI } = process.env
const loadModels = require('../app/models')

const dbType = process.env.NODE_ENV !== 'test' ? MONGO_URI : MONGO_URI_TEST

module.exports = () => {
  const connect = () => {
    console.log(dbType)
    mongoose.Promise = global.Promise
    mongoose.connect(
      dbType,
      {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      (err) => {
        let dbStatus = ''
        if (err) {
          dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`
        }
        dbStatus = '*    DB Connection: OK\n****************************\n'
        if (process.env.NODE_ENV !== 'test') {
          // Prints initialization
          console.log('****************************')
          console.log('*    Starting Server')
          console.log(`*    Port: ${process.env.PORT || 3000}`)
          console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`)
          console.log('*    Database: MongoDB')
          console.log(dbStatus)
        }
      }
    )
    mongoose.set('useCreateIndex', true)
    mongoose.set('useFindAndModify', false)
  }
  connect()

  mongoose.connection.on('error', console.log)
  mongoose.connection.on('disconnected', connect)

  loadModels()
}
