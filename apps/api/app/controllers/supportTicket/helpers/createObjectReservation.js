const _ = require('lodash')
const modelTour = require('../../../models/tour')
const modelDeparture = require('../../../models/departure')

const db = require('../../../middleware/db')

const createObjectReservation = (reservation) => new Promise(async (resolve) => {
  const { idTour, idDeparture } = reservation
  const filterReservation = _.pick(reservation, [
    '_id',
    'travelerFirstName',
    'travelerLastName',
    'travelerEmail',
    'idTour',
    'amount',
    'idDeparture',
    'code',
    'idUser',
    'idIntention'
  ])
  const tour = await db.getItem(idTour, modelTour)
  const departure = await db.getItem(idDeparture, modelDeparture)
  filterReservation.tourTitle = tour.title
  filterReservation.StartDate = departure.startDateDeparture
  resolve(filterReservation)
})

module.exports = { createObjectReservation }
