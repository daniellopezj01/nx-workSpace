/* eslint-disable no-await-in-loop */

/* eslint-disable no-restricted-syntax */
const i18n = require('i18n')
const { prepareToSendEmail } = require('./prepareToSendEmail')
const { htmlTour } = require('./parseHtmlEmails')
const modelTour = require('../../models/tour')
const modelDeparture = require('../../models/departure')
const db = require('../db')

const emailChangeToursInReservation = async (locale, reservation) => {
  i18n.setLocale(locale)
  reservation.tour = await db.getItem(reservation.idTour, modelTour)
  reservation.departure = await db.getItem(reservation.idDeparture, modelDeparture)
  const subject = i18n.__('updateTour.SUBJECT')
  const template = '_updateTour'
  const htmlMessage = await htmlTour(template, reservation)
  const { travelerFirstName, travelerLastName, travelerEmail } = reservation
  const tosend = {
    name: `${travelerFirstName || ''} ${travelerLastName || ''}`,
    email: travelerEmail
  }
  prepareToSendEmail(tosend, subject, htmlMessage)
}

module.exports = { emailChangeToursInReservation }
