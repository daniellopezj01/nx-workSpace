/* eslint-disable max-len */
const moment = require('moment')
const fs = require('fs')
const db = require('../../db')
const modelReservation = require('../../../models/reservation')
const modelTour = require('../../../models/tour')
const modelDeparture = require('../../../models/departure')

const htmlPayments = (object, template = '', user) => {
  return new Promise(async (resolve, reject) => {
    const {
      amount,
      description,
      idReservation,
      createdAt,
      platform,
      status,
      operationType,
      externalCode
    } = object
    let reservation
    let tour
    let beginTour
    let departure
    if (idReservation) {
      reservation = await db.getItem(idReservation, modelReservation)
      const { idTour, idDeparture } = reservation
      tour = await db.getItem(idTour, modelTour)
      departure = await db.getItem(idDeparture, modelDeparture)
      beginTour = moment(departure?.startDateDeparture, 'DD-MM-YYYY').format('DD [de] MMMM YYYY')
    }

    const createPayment = moment(createdAt, 'DD-MM-YYYY').format('DD [de] MMMM YYYY')
    fs.readFile(
      `${__dirname}/../../../templates/${template}.html`,
      'utf8',
      (err, data = {}) => {
        if (err) {
          reject(err)
          return
        }
        const operation = operationType === 'flights' ? 'vuelos' : ''
        data = data.replace(/TRAVELER_NAME/g, `${reservation?.travelerFirstName} ${reservation?.travelerLastName || ''}`)
        data = data.replace(/CODE_RESERVATION/g, reservation?.code)
        data = data.replace(/OPERATION_TYPE/g, operation)
        data = data.replace(/EXTERNAL_CODE/g, externalCode)
        data = data.replace(/BEGIN_TOUR/g, beginTour)
        data = data.replace(/TITLE_TOUR/g, tour?.title)
        data = data.replace(/AMOUNT/g, amount)
        data = data.replace(/EMAIL_USER/g, user?.email)
        data = data.replace(/NAME_USER/g, `${user?.name} ${user?.surname || ''}`)
        data = data.replace(/TOUR_NAME/g, description)
        data = data.replace(/TYPE_PLATFORM/g, platform)
        data = data.replace(/STATUS_PAYMENT/g, status)
        data = data.replace(/PAYMENT_DATE/g, createPayment)
        resolve(data)
      }
    )
  })
}

module.exports = { htmlPayments }
