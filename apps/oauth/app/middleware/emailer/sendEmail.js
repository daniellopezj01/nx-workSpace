const nodemailer = require('nodemailer')
const aws = require('@aws-sdk/client-ses')
const smtpTransport = require('nodemailer-smtp-transport')
// const sgTransport = require('nodemailer-sendgrid-transport')

// configure AWS SDK
// Recuerda estas variables deben existir en el ENV
// process.env.AWS_ACCESS_KEY_ID = "....";
// process.env.AWS_SECRET_ACCESS_KEY = "....";
const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: 'us-west-2'
})
/**
 * Sends email
 * @param {Object} data - data
 * @param {boolean} callback - callback
 */
const sendEmail = async (data = {}, callback) => {
  let auth = {}
  let options = {}
  let transporter = {}
  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      SES: { ses, aws }
    })
  } else {
    options = {
      host: process.env.EMAIL_SMTP,
      port: process.env.EMAIL_SMTP_PORT,
      auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASS
      }
    }
    auth = smtpTransport(options)
    transporter = nodemailer.createTransport(auth)
  }

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: `${data.user.name} <${data.user.email}>`,
    subject: data.subject,
    html: data.htmlMessage
  }
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err.message)
      return callback(false)
    }
    return callback(true)
  })
}

module.exports = { sendEmail }
