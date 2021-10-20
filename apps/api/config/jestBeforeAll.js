const clean = require('../clean.js')
const initMongo = require('./mongo.js')

module.exports = async () => {
  clean.clean()
  // initMongo()
}
