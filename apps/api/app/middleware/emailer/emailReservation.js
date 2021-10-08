const i18n = require('i18n')
const Tour = require('../../models/tour')
const Departure = require('../../models/departure')
const { prepareToSendEmail } = require('./prepareToSendEmail')
const { htmlReservation } = require('./parseHtmlEmails')
const db = require('../db')

const emailReservation = async (locale, reservation, type = 'create') => {
  reservation.tour = await db.getItem(reservation.idTour, Tour)
  reservation.departure = await db.getItem(reservation.idDeparture, Departure)
  i18n.setLocale(locale)
  let subject
  let template
  switch (type) {
    case 'create':
      subject = i18n.__('newReservation.SUBJECT')
      template = '_newReservation'
      break
    case 'update':
      subject = i18n.__('updateReservation.SUBJECT')
      template = '_modifiReservation'
      break
    case 'cancel':
      subject = i18n.__('cancelReservation.SUBJECT')
      template = '_cancelReservation'
      break
    default:
      break
  }
  const htmlMessage = await htmlReservation(reservation, template)
  const { travelerFirstName, travelerLastName, travelerEmail } = reservation
  const tosend = {
    name: `${travelerFirstName || ''} ${travelerLastName || ''}`,
    email: travelerEmail
  }
  prepareToSendEmail(tosend, subject, htmlMessage)
}

module.exports = { emailReservation }
