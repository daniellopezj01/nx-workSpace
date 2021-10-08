const i18n = require('i18n')
const { prepareToSendEmail } = require('./prepareToSendEmail')
const db = require('../db')
const settings = require('../../models/settings')
const modelUser = require('../../models/user')
const {
  htmlNewMessageAdmin,
  htmlNewTicket,
  htmlNewMessageUser
} = require('../../controllers/supportTicket/helpers/parseHtmlSupport')

const emailSupport = async (locale, ticket, type, message) => {
  i18n.setLocale(locale)
  let subject
  let htmlMessage
  const { travelerEmail } = ticket.customData
  let user
  switch (type) {
    case 'new_chat':
      subject = i18n.__('newChat.SUBJECT')
      htmlMessage = await htmlNewTicket(ticket, message)
      user = await db.findOne({ key: 'defaultEmail' }, settings)
      break
    case 'new_message_admin':
      user = await db.findOne({ email: travelerEmail }, modelUser)
      subject = i18n.__('newMessageUser.SUBJECT')
      htmlMessage = await htmlNewMessageUser(ticket, message)
      break
    case 'new_message_user':
      user = await db.findOne({ key: 'defaultEmail' }, settings)
      subject = i18n.__('newMessageAdmin.SUBJECT')
      htmlMessage = await htmlNewMessageAdmin(ticket, message)
      break
    default:
      subject = i18n.__('orderPay.SUBJECT')
      break
  }
  const {
    name, surname, email, _doc
  } = user
  const tosend = {
    name: `${name || ''} ${surname || ''}`,
    email: email || _doc.email
  }
  prepareToSendEmail(tosend, subject, htmlMessage)
}

module.exports = { emailSupport }
