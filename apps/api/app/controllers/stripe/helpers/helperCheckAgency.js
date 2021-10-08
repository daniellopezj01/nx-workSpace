const modelTour = require('../../../models/tour')
const modelReservation = require('../../../models/reservation')
const db = require('../../../middleware/db')

const helperCheckAgency = async (idReservation = null) => new Promise(async (resolve) => {
  if (idReservation) {
    const reservation = await db.getItem(idReservation, modelReservation)
    const { idTour } = reservation
    const tour = await db.getItem(idTour, modelTour)
    const { accountAgency } = tour
    resolve(accountAgency)
  } else {
    resolve(null)
  }
})

module.exports = { helperCheckAgency }
