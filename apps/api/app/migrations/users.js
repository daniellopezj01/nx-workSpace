const mysql = require('mysql')
const ora = require('ora')
const mongoose = require('mongoose')
const User = require('../models/user')

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

const saveUser = async (user) =>
  new Promise(async (resolve, reject) => {
    try {
      await user.save()
      resolve(true)
    } catch (error) {
      if (error.code === 11000) {
        // CODIGO DE DUPLICATE EMAIL MONGODB
        user.email = `${user.email}_duplicated`
        resolve(await saveUser(user))
      }
      if (error.message === 'User validation failed: avatar: NOT_A_VALID_URL') {
        user.avatar = ''
        resolve(await saveUser(user))
      }
      console.log('Error inesperado: ', error)
      console.log('Error codigo: ', error.code)
      reject(error)
    }
  })

connection.query('SELECT * FROM users', async (error, results) => {
  if (error) throw error
  const throbber = ora('Guardando usuarios').start()
  for (let i = 0; i < results.length; i++) {
    const usuario = new User({
      name: results[i].name,
      surname: results[i].last_name,
      gender: results[i].gender ? results[i].gender : 'O',
      email: results[i].email,
      document: results[i].document,
      avatar: results[i].avatar ? results[i].avatar : '',
      birthDate: results[i].birthday,
      phone: results[i].phone,
      password: results[i].password,
      description: results[i].about_me,
      country: results[i].country,
      position: results[i].position,
      customData: { ...JSON.parse(results[i].finger_print), id: results[i].id }
    })
    // eslint-disable-next-line no-await-in-loop
    await saveUser(usuario).catch((err) => {
      console.log(err.message)
    })
  }
  throbber.stop()
  console.log('Listoo!! Migracion exitosa')
})

connection.end()
