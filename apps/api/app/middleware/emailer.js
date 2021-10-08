const nodemailer = require('nodemailer')
const i18n = require('i18n')
const _ = require('lodash')
const fs = require('fs')
const aws = require('@aws-sdk/client-ses')
const User = require('../models/user')
const { itemAlreadyExists } = require('./utils')
const db = require('./db')

const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: 'us-west-2'
})

/**
 * Sends email
 * @param {Object} data - data
 * @param {boolean} callback - callback
 */
const sendEmail = async (data, callback) => {
  let options = {}
  let transporter = {}
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: `${data.user.name} <${data.user.email}>`,
    subject: data.subject,
    html: data.htmlMessage,
    bcc: process.env.EMAIL_BBC
  }

  if (process.env.NODE_ENV === 'production') {
    /**
     * SES Mail Production
     */
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
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err.message)
        return callback(false)
      }
      return callback(true)
    })
  }
}

/**
 * Prepares to send email
 * @param {string} email - email string
 * @param {string} subject - subject
 * @param {string} htmlMessage - html message
 */
const prepareToSendEmail = (user, subject, htmlMessage) => {
  user = {
    name: user.name || '',
    email: user.email || '',
    verification: user.verification || ''
  }
  const data = {
    user,
    subject,
    htmlMessage
  }
  if (process.env.NODE_ENV === 'production') {
    sendEmail(data, (messageSent) =>
      messageSent
        ? console.log(`Email SENT to: ${user.email}`)
        : console.log(`Email FAILED to: ${user.email}`)
    )
  } else if (process.env.NODE_ENV !== 'production') {
    sendEmail(data, (messageSent) =>
      messageSent
        ? console.log(`(DEV) Email SENT to: ${user.email}`)
        : console.log(`(DEV) Email FAILED to: ${user.email}`)
    )
  }
}

/**
 * Prepares to send email
 * @param {string} template - name the template
 * @param {string} data - subject
 */
const parseHtml = (template, info) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${__dirname}/../../app/templates/${template}.html`,
      'utf8',
      async (err, data) => {
        if (err) {
          reject(err)
          return
        }
        switch (template) {
          case '_orderPay':
            data = data.replace(/AMOUNT/g, info.amount)
            data = data.replace(/TOUR_NAME/g, info.description)
            break
          case '_firstPay':
            data = data.replace(/AMOUNT/g, info.amount)
            data = data.replace(/TOUR_NAME/g, info.description)
            break
          case '_lastPay':
            data = data.replace(/AMOUNT/g, info.amount)
            data = data.replace(/TOUR_NAME/g, info.description)
            break
          default:
            break
        }
        if (template === '_newMessage') {
          const user = await db.getItem(info.creator, User)
          data = data.replace(/FIRST_NAME/g, user.name)
          const url = `${process.env.FRONTEND_URL}/inbox/${info.hash}`
          const { avatar } = user
          avatar
            ? (data = data.replace(
              /AVATAR/g,
              `<img src="${avatar}" style="height: 60px; border-radius: 5px; box-shadow: 2px 2px 10px #666;">`
            ))
            : (data = data.replace(
              /AVATAR/g,
              `<a href="${url}" target="_blank" style="font-size: 25px; font-family: Open Sans, Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; background-color: #fdfdfd; padding: 10%; background-color: brown; box-shadow: 2px 2px 10px #666;">${info.creator.name
                .toUpperCase()
                .charAt(0)}</a>`
            ))
          data = data.replace(/NEW_MESSAGE/g, info.message)
          data = data.replace(/URL_HOST/g, url)
        }
        resolve(data)
      }
    )
  })
}

module.exports = {
  /**
   * Checks User model if user with an specific email exists
   * @param {string} email - user email
   */
  async emailExists(email) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, 'EMAIL_ALREADY_EXISTS')
          resolve(false)
        }
      )
    })
  },

  /**
   * Checks User model if user with an specific email exists but excluding user id
   * @param {string} id - user id
   * @param {string} email - user email
   */
  async emailExistsExcludingMyself(id, email) {
    return new Promise((resolve, reject) => {
      User.findOne(
        {
          email,
          _id: {
            $ne: id
          }
        },
        (err, item) => {
          itemAlreadyExists(err, item, reject, 'EMAIL_ALREADY_EXISTS')
          resolve(false)
        }
      )
    })
  },

  /**
   * Sends registration email
   * @param {string} locale - locale
   * @param {Object} user - user object
   */
  async sendRegistrationEmailMessage(locale, user) {
    i18n.setLocale(locale)
    const subject = i18n.__('registration.SUBJECT')
    const htmlMessage = i18n.__(
      'registration.MESSAGE',
      user.name,
      process.env.FRONTEND_URL,
      user.verification
    )
    prepareToSendEmail(user, subject, htmlMessage)
  },

  async sendNotificationMessage(payload, locale) {
    i18n.setLocale(locale)
    const lastMessage = _.head(payload.messages)
    const preLastMessage = _.nth(payload.messages, 1)
    const existPreMessage = !(
      preLastMessage && `${lastMessage._id}` === `${preLastMessage._id}`
    )
    const secondDelay = moment(lastMessage.dateCreate).diff(
      moment(preLastMessage.dateCreate),
      'seconds'
    )

    if (existPreMessage && secondDelay > parseInt(process.env.MESSAGE_DELAY)) {
      const subject = i18n.__('newMessage.SUBJECT')
      const htmlMessage = await parseHtml('_newMessage', lastMessage)
      const listEmail = _.filter(payload.members, (member) => {
        if (`${member}` !== `${lastMessage.creator}`) {
          return member
        }
      })

      _.forEach(listEmail, (member) => {
        db.getItem(member, User).then((user) => {
          console.log('Enviar -->', `${user.name}`)
          prepareToSendEmail(user, subject, htmlMessage)
        })
      })
    }
  }
}
