require('dotenv-safe').config()
const path = require('path')
const { Seeder } = require('mongo-seeding')

const { MONGO_TEST, DB_URL } = process.env
const dbType = process.env.NODE_ENV !== 'test' ? DB_URL : MONGO_TEST
const config = {
  database: dbType,
  inputPath: path.resolve(__dirname, './data'),
  dropDatabase: false
}
const seeder = new Seeder(config)
const collections = seeder.readCollectionsFromPath(path.resolve('./data'))

const main = async () => {
  try {
    await seeder.import(collections)
    console.log('Seed complete!')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(0)
  }
}

main()
