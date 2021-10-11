const fs = require('fs')

const htmlNewMessageUser = (ticket, message) => {
  return new Promise(async (resolve, reject) => {
    const {
      hash,
      customData
    } = ticket
    const { code, tourTitle } = customData
    const url = `${process.env.FRONTEND_URL}/trips/${code}/support/${hash}`
    fs.readFile(
      `${__dirname}/../../../../templates/_supportMessageForUser.html`,
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
        resolve(data)
      }
    )
  })
}

module.exports = { htmlNewMessageUser }
