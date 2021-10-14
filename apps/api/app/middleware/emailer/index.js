const { emailReservation } = require('./emailReservation')
const { emailPayments } = require('./emailPayments')
const {
  emailChangeToursInReservation
} = require('./emailChangeToursInReservation')
const { emailSupport } = require('./emailSupport')
const { prepareToSendEmail } = require('./prepareToSendEmail')
const { emailCancelReservation } = require('./emailCancelReservation')
const { sendEmail } = require('./sendEmail')
const { emailLinkAgency } = require('./emailLinkAgency')

module.exports = {
  prepareToSendEmail,
  sendEmail,
  emailReservation,
  emailPayments,
  emailChangeToursInReservation,
  emailSupport,
  emailCancelReservation,
  emailLinkAgency
}
