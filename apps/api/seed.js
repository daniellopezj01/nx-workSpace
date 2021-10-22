require('dotenv-safe').config()
const path = require('path')
const { Seeder } = require('mongo-seeding')

const DB_URL = process.env.MONGO_URI
const { MONGO_TEST } = process.env
const dbType = process.env.NODE_ENV !== 'test' ? DB_URL : MONGO_TEST
const config = {
  database: dbType,
  inputPath: path.resolve(__dirname, './data'),
  dropDatabase: false
}

const seeder = new Seeder(config)

const collections = seeder.readCollectionsFromPath(path.resolve('./apps/api/data'))


module.exports = async () => {
  try {
    await seeder.import(collections).catch(err => { console.log(err) })
    console.log('Seed complete!')
    // process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

// main()
