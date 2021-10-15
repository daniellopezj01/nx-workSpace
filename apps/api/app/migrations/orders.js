const mysql = require('mysql')
const Order = require('../models/payOrder')
const mongoose = require('mongoose')
const ora = require('ora')

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

const save = async (item) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(await item.save())
    } catch (error) {
      console.log('Error inesperado: ', error)
      // console.log('Error codigo: ', error.code)
      reject(error)
    }
  })

connection.query('SELECT * FROM `order`', async (error, results) => {
  if (error) {
    throw error
  }
  const throbber = ora('Guardando orders').start()
  for (let i = 0; i < results.length; i++) {
    const order = new Order({
      status: status(results[i].status),
      idOperation: results[i].id_operation
        ? results[i].id_operation
        : 'undefined',
      amount: results[i].amount,
      currency: results[i].currency,
      idUser: results[i].id_user,
      idReservation: results[i].reservation_id,
      attached: results[i].attached,
      platform: results[i].platform ? results[i].platform : 'stripe',
      description: results[i].description,
      authenticated: JSON.parse(results[i].authenticated),
      customData: {
        currencyChange: JSON.parse(results[i].currency_change),
        way: results[i].way
      }
    })
    await save(order)
  }
  throbber.stop()
  console.log('Listoo!! Migracion exitosa')
})

status = (type) => {
  switch (type) {
    case 'success':
      return 'succeeded'
      break
    case 'hold-verify':
      return 'failure'
      break
    default:
      return type
      break
  }
}
