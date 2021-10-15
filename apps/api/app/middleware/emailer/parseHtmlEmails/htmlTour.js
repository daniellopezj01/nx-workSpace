const fs = require('fs')
const moment = require('moment')

const htmlTour = (template = '', reservation) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${__dirname}/../../../templates/${template}.html`,
      'utf8',
      (err, data = {}) => {
        if (err) {
          reject(err)
          return
        }
        const { tour, departure } = reservation
        const begin = moment(
          departure?.startDateDeparture,
          'DD-MM-YYYY'
        ).format('DD [de] MMMM YYYY')
        const close = moment(
          departure?.closeDateDeparture,
          'DD-MM-YYYY'
        ).format('DD [de] MMMM YYYY')
        data = data.replace(/TITLE_TOUR/g, tour?.title)
        data = data.replace(
          /NAME_USER/g,
          `${reservation?.travelerFirstName} ${reservation?.travelerLastName || ''
          }`
        )
        data = data.replace(/CODE_RESERVATION/g, reservation?.code)
        data = data.replace(/BEGIN_TOUR/g, begin)
        data = data.replace(/LIMIT_PAYMENT_TOUR/g, close)
        data = data.replace(/PRICE/g, parseFloat(reservation.amount).toFixed(2))
        resolve(data)
      }
    )
  })
}

module.exports = { htmlTour }
