const modelReservation = require('../../../models/reservation')
const db = require('../../../middleware/db')

const helperChangeStatusReservation = (payOrder, pending) => new Promise(async (resolve) => {
  const { idReservation } = payOrder
  pending = Number(Math.trunc(pending * 100) / 100, 2)
  const status = payOrder.status === 'succeeded' && pending <= 0 ? 'completed' : 'progress'
  const reservation = await db.updateItem(idReservation, modelReservation, {
    status
  })
  resolve(reservation)
})

module.exports = { helperChangeStatusReservation }
