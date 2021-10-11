const nodemailer = require('nodemailer')
const aws = require('@aws-sdk/client-ses')
const settings = require('../../models/settings')
const db = require('../db')

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
  try {
    let options = {}
    let transporter = {}
    const { htmlMessage, user } = data
    let defaultEmail = await db.findOne({ key: 'defaultEmail' }, settings, 'key email name')
    defaultEmail = defaultEmail._doc
    const emails = [
      {
        name: user.name,
        email: user.email
      },
      {
        name: defaultEmail.name,
        email: defaultEmail.email
      }
    ]
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
      transporter = nodemailer.createTransport(options)
    }
    if (process.env.NODE_ENV !== 'test') {
      emails.forEach((toUser) => {
        const mailOptions = {
          from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
          to: `${toUser.name} <${toUser.email}>`,
          subject: data.subject,
          html: htmlMessage
        }
        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            console.log(err.message)
          }
        })
      })
      return callback(true)
    }
  } catch (error) {
    console.log(error)
    return callback(false)
  }
}

module.exports = { sendEmail }
