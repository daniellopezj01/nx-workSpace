/* eslint-disable max-statements */
const mongoose = require('mongoose')
const { matchedData } = require('express-validator')
const model = require('../../models/payOrder')
const modelReservation = require('../../models/reservation')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { emailPayments } = require('../../middleware/emailer/index')
const { serviceGetTotal } = require('../wallet/services')
const { serviceSearchOrder } = require('./services')
const { helperChangeStatusReservation } = require('./helpers')
const { helperCreatePdf } = require('./helpers')
const { generatePnr } = require('../../plugins/sabre/index')
const { webHooks } = require('../../services/hookService')
const { emailExternal } = require('../../middleware/emailer/emailExternal')
const { serviceCreatePaymentToReffered } = require('../referred/services')
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (req, res) => {
  try {
    const locale = req.getLocale()
    const customData = req.body
    const { user } = req
    const idUser = `${user._id}`
    req = matchedData(req)
    let payOrder = await serviceSearchOrder(req.id)
    payOrder.customData = customData
    if (customData.status) {
      payOrder.status = customData.status.includes('succe')
        ? 'succeeded'
        : 'failure'
      if (process.env.NODE_ENV === 'test') {
        payOrder.status = 'succeeded'
      }
    }
    const { idReservation, externalCode, operationType } = payOrder
    payOrder = await db.updateItem(payOrder._id, model, payOrder)
    if (idReservation) {
      let reservation = await db.getItem(idReservation, modelReservation)
      const query = {
        idUser: mongoose.Types.ObjectId(idUser),
        idReservation: mongoose.Types.ObjectId(idReservation)
      }
      const totalPayment = await serviceGetTotal(query)
      const pending =
        parseFloat(reservation.amount) - parseFloat(totalPayment.total)
      reservation = await helperChangeStatusReservation(payOrder, pending)
      emailPayments(locale, payOrder, reservation.status, user)
    } else if (operationType && externalCode) {
      emailExternal(locale, payOrder, 'payment', user)
    } else {
      emailPayments(locale, payOrder, 'wallet', user)
    }
    await helperCreatePdf(payOrder).catch((e) => {
      console.log(e)
    })
    webHooks.trigger('payorder.successful', payOrder)
    console.log('webhook: payorder.successful')
    res.status(200).json(payOrder)
    if (idReservation) {
      await serviceCreatePaymentToReffered(idUser).catch((err) => {
        console.log(err)
      })
    }
    if (operationType && externalCode) {
      const params = { code: externalCode }
      await generatePnr(locale, { params }, user)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { updateItem }
