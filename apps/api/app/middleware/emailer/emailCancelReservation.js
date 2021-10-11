/* eslint-disable no-await-in-loop */

/* eslint-disable no-restricted-syntax */
const i18n = require('i18n')
const { prepareToSendEmail } = require('./prepareToSendEmail')
const { htmlTour } = require('./parseHtmlEmails')
const modelTour = require('../../models/tour')
const db = require('../db')

const emailCancelReservation = async (locale, reservation) => {
  i18n.setLocale(locale)
  reservation.tour = await db.getItem(reservation.idTour, modelTour)
  const subject = i18n.__('cancelReservation.SUBJECT')
  const template = '_cancelReservation'
  const htmlMessage = await htmlTour(template, reservation)
  const { travelerFirstName, travelerLastName, travelerEmail } = reservation
  const tosend = {
    name: `${travelerFirstName || ''} ${travelerLastName || ''}`,
    email: travelerEmail
  }
  prepareToSendEmail(tosend, subject, htmlMessage)
}

module.exports = { emailCancelReservation }
