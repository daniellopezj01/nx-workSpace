const db = require('../../app/middleware/db')
const payments = require('../../app/models/paymentMethods')

let stripe

const createStripe = async (pk) =>
  new Promise(async (resolve) => {
    const key =
      process.env.NODE_ENV === 'production' ? 'publicKeyProd' : 'publicKeyTest'
    const object = { [key]: pk }
    const paymentMethod = await db.findOne(
      object,
      payments,
      'privateKeyProd privateKeyTest'
    )
    const { privateKeyTest, privateKeyProd } = paymentMethod
    const sk =
      process.env.NODE_ENV === 'production' ? privateKeyProd : privateKeyTest
    stripe = require('stripe')(sk)
    resolve(stripe)
  })

module.exports = { createStripe }
