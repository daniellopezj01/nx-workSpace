/* eslint-disable max-len */
const moment = require('moment')
const fs = require('fs')

const htmlNewTicket = (ticket, message) => {
  return new Promise(async (resolve, reject) => {
    const {
      _id,
      hash,
      createdAt,
      customData
    } = ticket

    const createTicket = moment(createdAt, 'DD-MM-YYYY').format('DD [de] MMMM YYYY')
    const url = `${process.env.FRONTEND_PANEL}/support/${_id}`
    fs.readFile(
      `${__dirname}/../../../../templates/_supportNewTicket.html`,
      'utf8',
      (err, data = {}) => {
        if (err) {
          reject(err)
          return
        }
        data = data.replace(/MESSAGE_RECEIVE/g, message)
        data = data.replace(/GO_TO_URL/g, url)
        data = data.replace(/SUPPORT_HASH/g, hash)
        data = data.replace(/RESERVATION_CODE/g, customData.code)
        data = data.replace(/TOUR_TITLE/g, customData.tourTitle)
        data = data.replace(/TRAVELER_NAME/g, `${customData?.travelerFirstName} ${customData?.travelerLastName || ''}`)
        data = data.replace(/TRAVELER_EMAIL/g, customData.travelerEmail)
        data = data.replace(/CREATE_DATE/g, createTicket)
        resolve(data)
      }
    )
  })
}

module.exports = { htmlNewTicket }
