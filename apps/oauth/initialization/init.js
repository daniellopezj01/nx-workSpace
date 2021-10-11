require('dotenv-safe').config({
  allowEmptyValues: true,
  example: '../.env.example',
  path: '../.env'
})
const fs = require('fs')
const { MongoClient } = require('mongodb')

/**
 * Insert settings defaults
 */

const insertMachines = async (db) => {
  try {
    const dataIn = await db.collection('machines').find().toArray()
    if (!dataIn.length) {
      const machines = await db.collection('machines')
      const jsonData = await fs.readFileSync('./machines.json')
      const dataParse = JSON.parse(jsonData)
      machines.insertOne(dataParse, (e) => {
        console.log(e)
      })
      console.log('***** MACHINES LOADED *****')
    } else {
      console.log('***** MACHINES ALREADY LOADED *****')
    }
  } catch (e) {
    console.log('ERROR en INSERT')
  }
}

MongoClient.connect(process.env.MONGO_URI, async (err, client) => {
  console.log(process.env.MONGO_URI)
  if (err) {
    throw new Error('Database failed to connect!')
  } else {
    console.log('MongoDB successfully connected on port 27017.')
  }

  const db = client.db()
  await insertMachines(db)
  // process.exit(0)
})
