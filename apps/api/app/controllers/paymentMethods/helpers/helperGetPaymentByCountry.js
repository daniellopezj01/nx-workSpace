const paymentModel = require('../../../models/paymentMethods')
const db = require('../../../middleware/db')
const utils = require('../../../middleware/utils')

const helperGetPaymentByCountry = async (keyCountry = '') => new Promise(async (resolve, reject) => {
  try {
    let payment
    if (keyCountry) {
      const object = { country: keyCountry }
      payment = await db.findOne(object, paymentModel)
      const { publicKeyProd, publicKeyTest } = payment
      const publicKey = process.env.NODE_ENV === 'production' ? publicKeyProd : publicKeyTest
      resolve(publicKey)
    } else {
      reject(utils.buildErrObject(422, 'NOT_FOUND_PAYMENT_METHOD'))
    }
  } catch (error) {
    reject(utils.buildErrObject(422, 'NOT_FOUND_PAYMENT_METHOD'))
  }
})

module.exports = { helperGetPaymentByCountry }
