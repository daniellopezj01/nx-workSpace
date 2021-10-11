const i18n = require('i18n')
const { prepareToSendEmail } = require('./prepareToSendEmail')
const { htmlForgetPassword } = require('./parseHtmlEmails/index')

/**
 * Sends reset password email
 * @param {string} locale - locale
 * @param {Object} user - user object
 */
const sendResetPasswordEmailMessage = async (locale = '', object) => {
  i18n.setLocale(locale)
  const subject = i18n.__('forgotPassword.SUBJECT')
  const htmlMessage = await htmlForgetPassword(object)
  prepareToSendEmail(object, subject, htmlMessage)
}

module.exports = { sendResetPasswordEmailMessage }
