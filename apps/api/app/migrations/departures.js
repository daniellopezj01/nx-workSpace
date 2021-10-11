const mysql = require('mysql')
const mongoose = require('mongoose')
const ora = require('ora')
const Departure = require('../models/departure')

mongoose.connect('mongodb://localhost:27017/migrations', {
  // useUnifiedTopology: true,
  useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connection Successful!')
})

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mochileros'
})

connection.connect()

connection.query('SELECT * FROM departures', async (error, results) => {
  if (error) throw error
  const throbber = ora('Guardando departures').start()
  for (let i = 0; i < results.length; i++) {
    const departure = new Departure({
      startDateDeparture: results[i].start,
      endDateDeparture: results[i].finish,
      stock: results[i].stock,
      minStock: results[i].stock_min,
      normalPrice: results[i].price_normal,
      specialPrice: results[i].price_regular,
      closeDateDeparture: results[i].date_close,
      status: status(results[i].status),
      flight: results[i].flight === 'yes',
      idTour: results[i].item_id,
      startLocationDeparture: {
        type: 'Point',
        coordinates: [results[i].point_lng, results[i].point_lat]
      },
      endLocationDeparture: {
        type: 'Point',
        coordinates: [0, 0]
      },
      customData: {
        currency: JSON.parse(results[i].currency_value),
        ...JSON.parse(results[i].extra_data),
        point_content: results[i].point_content
      }
    })
    await save(departure)
  }
  throbber.stop()
  console.log('Listoo!! Migracion exitosa')
})

status = (type) => {
  switch (type) {
    case 'ok':
      return 'OK'
      break
    case 'danger':
      return 'warning'
      break
    default:
      return type
      break
  }
}

const save = async (item) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(await item.save())
    } catch (error) {
      console.log('Error inesperado: ', error)
      console.log('Error codigo: ', error.code)
      reject(error)
    }
  })
