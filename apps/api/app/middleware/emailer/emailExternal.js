const i18n = require('i18n')
const { prepareToSendEmail } = require('./prepareToSendEmail')
const { htmlExternal } = require('./parseHtmlEmails')

const emailExternal = async (locale, object, type, user) => {
  i18n.setLocale(locale)
  let subject
  let template
  switch (type) {
    case 'payment':
      subject = i18n.__('externalOperationPayment.SUBJECT')
      template = 'externalOperation/_externalOperation'
      break
    case 'successPnr':
      subject = i18n.__('successPnr.SUBJECT')
      template = 'externalOperation/_successPnr'
      break
    case 'errorPnr':
      subject = i18n.__('errorPnr.SUBJECT')
      template = 'externalOperation/_errorPnr'
      break
    default:
      subject = i18n.__('orderPay.SUBJECT')
      template = 'externalOperation/_externalOperation'
      break
  }
  const htmlMessage = await htmlExternal(object, template, user)
  const { name, surname, email } = user
  const tosend = {
    name: `${name || ''} ${surname || ''}`,
    email
  }
  prepareToSendEmail(tosend, subject, htmlMessage)
}

module.exports = { emailExternal }
