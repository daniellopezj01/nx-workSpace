const db = require('../../../middleware/db')
const modelReffered = require('../../../models/referredUsers')
const { serviceCreateForReffered } = require('../../payOrders/services')

const serviceCreatePaymentToReffered = (userTo = undefined) => new Promise(async (resolve, reject) => {
  try {
    if (userTo) {
      const referred = await db.findOne({ userTo }, modelReffered)
      const {
        _id, status, userFrom, code, amountFrom
      } = referred
      if (status === 'available') {
        // await serviceCreateForReffered(userTo, amountTo, code)
        await serviceCreateForReffered(userFrom, amountFrom, code)
        await db.updateItem(_id, modelReffered, { status: 'unavailable' })
      } else {
        console.log('REFERRED IS NOT AVALAIBLE')
        resolve({})
      }
    } else {
      reject()
    }
  } catch (error) {
    reject('ERROR_SERVICE_CREATE_PAYMENT_REFFERED')
  }
})

module.exports = { serviceCreatePaymentToReffered }
