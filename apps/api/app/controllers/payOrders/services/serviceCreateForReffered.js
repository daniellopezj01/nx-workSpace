const modelPayOrder = require('../../../models/payOrder')
const db = require('../../../middleware/db')

const serviceCreateForReffered = (idUser, amount, code) => new Promise(async (resolve, reject) => {
  try {
    const object = {
      idUser,
      amount,
      status: 'succeeded',
      idOperation: `pago referido (${code})`,
      description: `pago referido (${code})`
    }
    const order = await db.createItem(object, modelPayOrder)
    resolve(order)
  } catch (error) {
    console.log(error.message)
    reject()
  }
})

module.exports = { serviceCreateForReffered }
