/* eslint-disable max-len */
const moment = require('moment')
const fs = require('fs')

const htmlPaymentWallet = (payOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      amount,
      createdAt,
      platform,
      code,
      status
    } = payOrder

    const createPayment = moment(createdAt, 'DD-MM-YYYY').format('DD [de] MMMM YYYY')
    fs.readFile(
      `${__dirname}/../../../../templates/_supportWallet.html`,
      'utf8',
      (err, data = {}) => {
        if (err) {
          reject(err)
          return
        }
        data = data.replace(/AMOUNT/g, amount)
        data = data.replace(/CODE_PAY_ORDER/g, code)
        data = data.replace(/TYPE_PLATFORM/g, platform)
        data = data.replace(/STATUS_PAYMENT/g, status)
        data = data.replace(/PAYMENT_DATE/g, createPayment)
        resolve(data)
      }
    )
  })
}

module.exports = { htmlPaymentWallet }
