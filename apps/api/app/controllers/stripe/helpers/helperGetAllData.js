const modelReservation = require('../../../models/reservation')
const modelTour = require('../../../models/tour')
const modelDeparture = require('../../../models/departure')
const db = require('../../../middleware/db')

const helperGetAllData = (reference) => new Promise(async (resolve) => {
  let reservation
  reservation = await db.getItem(reference, modelReservation).catch(() => { reservation = null })
  if (reservation) {
    const { idTour, idDeparture } = reservation
    const tour = await db.getItem(idTour, modelTour)
    const departure = await db.getItem(idDeparture, modelDeparture)
    resolve({
      reservation,
      tour,
      departure
    })
  } else {
    resolve({})
  }
})

module.exports = { helperGetAllData }
