/* eslint-disable no-unused-vars */
const path = require('path')
const htmlToPdf = require('html-pdf-node')
const { helperUploadMedia } = require('../../storage/helpers')
const { htmlPaymentReservation, htmlPaymentWallet } = require('./parseHtmlPayment')
const db = require('../../../middleware/db')
const modelPayOrder = require('../../../models/payOrder')

const helperCreatePdf = (payOrder) => new Promise(async (resolve, reject) => {
  const { idReservation, code } = payOrder
  const name = `pdf_order_${code}.pdf`
  const destinationUrl = path.resolve(__dirname, `../../../../public/media/${name}`)
  const html = idReservation ? await htmlPaymentReservation(payOrder) : await htmlPaymentWallet(payOrder)
  const options = { format: 'A4', path: destinationUrl, name }
  const file = { content: html }
  htmlToPdf.generatePdf(file, options).then(async (outPut) => {
    // console.log('se tiene buffer del PDF', outPut)
    const urlS3 = await helperUploadMedia(name).catch((err) => {
      console.log('helperUploadMedia', err)
    })
    const { _id } = payOrder
    resolve(await db.updateItem(_id, modelPayOrder, { attached: urlS3 }))
  }).catch((err) => {
    console.log('htmlToPdf', err)
    reject(err)
  })
  // htmlToPdf.generatePdf(file, options, async (err, res) => {
  //   console.log(res)
  //   if (err) {
  //     console.log(err)
  //     reject(err)
  //   }
  //   const urlS3 = await helperUploadMedia(name)
  //   const { _id } = payOrder
  //   resolve(await db.updateItem(_id, modelPayOrder, { attached: urlS3 }))
  // })
})

module.exports = { helperCreatePdf }
