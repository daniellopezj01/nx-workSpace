const i18n = require('i18n')
const mongoose = require('mongoose')
const { prepareToSendEmail } = require('./prepareToSendEmail')
const { htmlPayments } = require('./parseHtmlEmails')
const managerWallet = require('../../services/managerWallet')

const emailPayments = async (locale, order, type, user) => {
  i18n.setLocale(locale)
  let subject
  let template
  let transactions
  let idReservation
  switch (type) {
    case 'progress':
      idReservation = mongoose.Types.ObjectId(order.idReservation)
      transactions = await managerWallet.getTransactions({ idReservation })
      subject = i18n.__('orderPay.SUBJECT')
      template = transactions.length === 1 ? '_firstPay' : '_orderPay'
      break
    case 'completed':
      subject = i18n.__('lastPay.SUBJECT')
      template = '_lastPay'
      break
    case 'wallet':
      subject = i18n.__('orderPay.SUBJECT')
      template = '_wallet'
      break
    default:
      subject = i18n.__('orderPay.SUBJECT')
      template = '_orderPay'
      break
  }
  const htmlMessage = await htmlPayments(order, template, user)
  const { name, surname, email } = user
  const tosend = {
    name: `${name || ''} ${surname || ''}`,
    email
  }
  prepareToSendEmail(tosend, subject, htmlMessage)
}

module.exports = { emailPayments }
