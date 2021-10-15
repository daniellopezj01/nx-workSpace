const fs = require('fs')
const moment = require('moment')

const htmlReservation = (object, template = '') => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${__dirname}/../../../templates/${template}.html`,
      'utf8',
      (err, data = {}) => {
        if (err) {
          reject(err)
          return
        }
        const { tour, departure } = object
        const begin = moment(
          departure?.startDateDeparture,
          'DD-MM-YYYY'
        ).format('DD [de] MMMM YYYY')
        const end = moment(departure?.endDateDeparture, 'DD-MM-YYYY').format(
          'DD [de] MMMM YYYY'
        )
        data = data.replace(/TITLE_TOUR/g, tour.title)
        data = data.replace(/CODE_RESERVATION/g, object.code)
        data = data.replace(
          /STATUS/g,
          object?.status ? object?.status.toLowerCase() : 'PENDING'
        )
        data = data.replace(
          /TRAVELER_NAME/g,
          `${object?.travelerFirstName} ${object?.travelerLastName || ''}`
        )
        data = data.replace(/BEGIN_TOUR/g, begin)
        data = data.replace(/END_TOUR/g, end)
        data = data.replace(/PRICE/g, parseFloat(object.amount).toFixed(2))
        resolve(data)
      }
    )
  })
}

module.exports = { htmlReservation }
