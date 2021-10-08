/* eslint-disable max-len */
const moment = require('moment')
const fs = require('fs')
const db = require('../../../../middleware/db')
const modelReservation = require('../../../../models/reservation')
const modelTour = require('../../../../models/tour')
const modelDeparture = require('../../../../models/departure')

const htmlPaymentReservation = (payOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      amount,
      idReservation,
      createdAt,
      platform,
      code,
      status
    } = payOrder
    const reservation = await db.getItem(idReservation, modelReservation)

    const {
      idTour,
      idDeparture,
      travelerFirstName,
      travelerLastName
    } = reservation
    const tour = await db.getItem(idTour, modelTour)
    const departure = await db.getItem(idDeparture, modelDeparture)
    const beginTour = moment(departure.startDateDeparture, 'DD-MM-YYYY').format('DD [de] MMMM YYYY')

    const createPayment = moment(createdAt, 'DD-MM-YYYY').format('DD [de] MMMM YYYY')
    fs.readFile(
      `${__dirname}/../../../../templates/_supportReservation.html`,
      'utf8',
      (err, data = {}) => {
        if (err) {
          reject(err)
          return
        }
        data = data.replace(/TRAVELER_NAME/g, `${travelerFirstName} ${travelerLastName || ''}`)
        data = data.replace(/CODE_RESERVATION/g, reservation?.code)
        data = data.replace(/CODE_PAY_ORDER/g, code)
        data = data.replace(/BEGIN_TOUR/g, beginTour)
        data = data.replace(/TITLE_TOUR/g, tour?.title)
        data = data.replace(/AMOUNT/g, amount)
        data = data.replace(/BUYER_NAME/g, `${travelerFirstName} ${travelerLastName || ''}`)
        data = data.replace(/TYPE_PLATFORM/g, platform)
        data = data.replace(/STATUS_PAYMENT/g, status)
        data = data.replace(/PAYMENT_DATE/g, createPayment)
        resolve(data)
      }
    )
  })
}

module.exports = { htmlPaymentReservation }
