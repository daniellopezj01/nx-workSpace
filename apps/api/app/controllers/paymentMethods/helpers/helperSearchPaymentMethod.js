const modelTour = require('../../../models/tour')
const paymentModel = require('../../../models/paymentMethods')
const db = require('../../../middleware/db')

const helperSearchPaymentMethod = async (idTour = null) => new Promise(async (resolve) => {
  let payment
  if (idTour) {
    let paymentValue
    await db.getItem(idTour, modelTour).then(({ paymentMethod }) => {
      paymentValue = paymentMethod
    }).catch(() => {
      paymentValue = null
    })
    const object = paymentValue ? { codePayment: paymentValue } : { default: true }
    payment = await db.findOne(object, paymentModel)
  } else {
    payment = await db.findOne({ default: true }, paymentModel)
  }
  const { publicKeyProd, publicKeyTest } = payment
  const publicKey = process.env.NODE_ENV === 'production' ? publicKeyProd : publicKeyTest
  resolve(publicKey)
})

module.exports = { helperSearchPaymentMethod }
