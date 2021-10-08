/* eslint-disable max-len */
const moment = require('moment')
const fs = require('fs')

const htmlExternal = (object, template = '', user) => {
  return new Promise(async (resolve, reject) => {
    const {
      amount,
      description,
      createdAt,
      platform,
      statusPnr,
      status, // order
      idPnr,
      operationType,
      externalCode,
      code

    } = object

    const createPayment = moment(createdAt, 'DD-MM-YYYY').format('DD [de] MMMM YYYY')
    fs.readFile(
      `${__dirname}/../../../templates/${template}.html`,
      'utf8',
      (err, data = {}) => {
        if (err) {
          reject(err)
          return
        }
        const operation = operationType === 'flights' ? 'vuelos' : ''
        data = data.replace(/ID_PNR/g, idPnr)
        data = data.replace(/STATUS_PNR/g, statusPnr)
        data = data.replace(/OPERATION_TYPE/g, operation)
        data = data.replace(/EXTERNAL_CODE/g, externalCode)
        data = data.replace(/CODE_PNR/g, code)
        data = data.replace(/AMOUNT/g, amount)
        data = data.replace(/EMAIL_USER/g, user?.email)
        data = data.replace(/NAME_USER/g, `${user?.name} ${user?.surname || ''}`)
        data = data.replace(/TOUR_NAME/g, description)
        data = data.replace(/TYPE_PLATFORM/g, platform)
        data = data.replace(/STATUS_PAYMENT/g, status)
        data = data.replace(/PAYMENT_DATE/g, createPayment)
        resolve(data)
      }
    )
  })
}

module.exports = { htmlExternal }
