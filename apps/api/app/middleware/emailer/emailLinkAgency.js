/* eslint-disable no-await-in-loop */

/* eslint-disable no-restricted-syntax */
const i18n = require('i18n')
const { prepareToSendEmail } = require('./prepareToSendEmail')
const { htmlLinkAgency } = require('./parseHtmlEmails')
const settings = require('../../models/settings')
const db = require('../db')

const emailLinkAgency = async (locale, userAgency) => {
  i18n.setLocale(locale)
  const subject = i18n.__('linkAgency.SUBJECT')
  const template = '_linkAgency'
  let user = await db.findOne(
    { key: 'defaultEmail' },
    settings,
    'key email name'
  )
  const htmlMessage = await htmlLinkAgency(template, userAgency)
  const { name, lastName } = user
  user = user._doc
  const tosend = {
    name: `${name || ''} ${lastName || ''}`,
    email: user.email
  }
  prepareToSendEmail(tosend, subject, htmlMessage)
}

module.exports = { emailLinkAgency }
