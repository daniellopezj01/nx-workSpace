/* eslint-disable max-len */
const fs = require('fs')

const htmlNewMessageAdmin = (ticket, message) => {
  return new Promise(async (resolve, reject) => {
    const {
      _id,
      hash,
      customData
    } = ticket
    const {
      code, tourTitle, travelerFirstName, travelerLastName, travelerEmail
    } = customData
    const url = `${process.env.FRONTEND_PANEL}/support/${_id}`
    fs.readFile(
      `${__dirname}/../../../../templates/_supportMessageForAdmin.html`,
      'utf8',
      (err, data = {}) => {
        if (err) {
          reject(err)
          return
        }
        data = data.replace(/MESSAGE_RECEIVE/g, message)
        data = data.replace(/GO_TO_URL/g, url)
        data = data.replace(/SUPPORT_HASH/g, hash)
        data = data.replace(/RESERVATION_CODE/g, code)
        data = data.replace(/TOUR_TITLE/g, tourTitle)
        data = data.replace(/TRAVELER_NAME/g, `${travelerFirstName} ${travelerLastName || ''}`)
        data = data.replace(/TRAVELER_EMAIL/g, travelerEmail)
        resolve(data)
      }
    )
  })
}

module.exports = { htmlNewMessageAdmin }
