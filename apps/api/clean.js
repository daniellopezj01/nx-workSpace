require('dotenv-safe').config()
const fs = require('fs')
const initMongo = require('./config/mongo')

const modelsPath = './apps/api/app/models'
const { removeExtensionFromFile } = require('./app/middleware/utils')
const seed = require('./seed')


// Loop models path and loads every file as a model except index file
const models = fs.readdirSync(modelsPath).filter((file) => {
  return removeExtensionFromFile(file) !== 'index'
})

const deleteModelFromDB = (model) => {
  return new Promise((resolve, reject) => {
    model = removeExtensionFromFile(model)
    model = require(`./app/models/${model}`)
    model.deleteMany({}, (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

const clean = async () => {
  try {
    const promiseArray = models.map(
      // eslint-disable-next-line no-return-await
      async (model) => await deleteModelFromDB(model)
    )
    await Promise.all(promiseArray).catch(err => { console.log(err) })
    console.log('Cleanup complete!')
    await seed.main()

    // process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

module.exports = { clean }

// clean()
