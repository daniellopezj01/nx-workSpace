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

const insertSettings = async (db) => {
  try {
    const dataIn = await db.collection('settings').find().toArray()
    if (!dataIn.length) {
      const settings = await db.collection('settings')
      const jsonData = await fs.readFileSync('./machines.json')
      const dataParse = JSON.parse(jsonData)
      settings.insertOne(dataParse)
      console.log('***** SETTINGS LOADED *****')
    } else {
      console.log('***** SETTINGS ALREADY LOADED *****')
    }
  } catch (e) {
    console.log('ERROR en INSERT')
  }
}

/**
 * Tours
 */
const insertTours = async (db) => {
  try {
    const dataIn = await db.collection('tours').find().toArray()
    if (!dataIn.length) {
      const settings = await db.collection('tours')
      const jsonData = await fs.readFileSync('./tours.json')
      const dataParse = JSON.parse(jsonData)
      settings.insertOne(dataParse)
      console.log('***** TOURS LOADED *****')
    } else {
      console.log('***** TOURS ALREADY LOADED *****')
    }
  } catch (e) {
    console.log('ERROR en INSERT')
  }
}

/**
 * Categoaries
 */
const insertCategories = async (db) => {
  try {
    const dataIn = await db.collection('categories').find().toArray()
    if (!dataIn.length) {
      const categories = await db.collection('categories')
      const jsonData = await fs.readFileSync('./categories.json')
      const dataParse = JSON.parse(jsonData)
      categories.insertOne(dataParse)
      console.log('***** CATEGORIES LOADED *****')
    } else {
      console.log('***** CATEGORIES ALREADY LOADED *****')
    }
  } catch (e) {
    console.log('ERROR en INSERT')
  }
}

/**
 * Categoaries
 */
const insertContinents = async (db) => {
  try {
    const dataIn = await db.collection('continents').find().toArray()
    if (!dataIn.length) {
      const continents = await db.collection('continents')
      const jsonData = await fs.readFileSync('./continents.json')
      const dataParse = JSON.parse(jsonData)
      continents.insertOne(dataParse)
      console.log('***** CONTINENTS LOADED *****')
    } else {
      console.log('***** CONTINENTS ALREADY LOADED *****')
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
  console.log('ENTRO A INIT')
  const db = client.db()
  await insertSettings(db)
  await insertTours(db)
  await insertCategories(db)
  await insertContinents(db)
  // process.exit(0)
})
