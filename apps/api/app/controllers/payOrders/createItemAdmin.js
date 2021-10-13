/* eslint-disable max-statements */
const { matchedData } = require('express-validator')
const model = require('../../models/payOrder')
const modelUser = require('../../models/user')
const modelReservation = require('../../models/reservation')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperCreatePdf } = require('./helpers')
const { helperCheckKey } = require('../wallet/helpers')
const { serviceGetTotal } = require('../wallet/services')
const { emailPayments } = require('../../middleware/emailer/index')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const createItemAdmin = async (req, res) => {
  try {
    const locale = req.getLocale()
    const data = matchedData(req)
    const updateReservation = {}
    const { idReservation } = data
    const payOrder = await db.createItem(data, model)
    const user = await db.getItem(payOrder.idUser, modelUser)
    if (idReservation) {
      const reservation = await db.getItem(idReservation, modelReservation)
      const query = await helperCheckKey(idReservation)
      const totalPayment = await serviceGetTotal(query)
      updateReservation.status =
        parseFloat(reservation.amount) > totalPayment.total
          ? 'progress'
          : 'completed'
      await db.updateItem(idReservation, modelReservation, updateReservation)
      emailPayments(locale, payOrder, reservation.status, user)
    } else {
      emailPayments(locale, payOrder, 'wallet', user)
    }
    const response = await helperCreatePdf(payOrder).catch((err) => {
      console.log(err)
      return payOrder
    })
    res.status(201).json(response)
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { createItemAdmin }
