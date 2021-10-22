const clean = require('../clean.js')
const seed = require('../seed')

module.exports = async () => {
  await clean()
  await seed()
  console.log('complete jest BEFORE ALL')
}
