/* eslint-disable max-statements */
const { matchedData } = require('express-validator')
const model = require('../../models/referredUsers')
const modelUser = require('../../models/user')
const modelReservation = require('../../models/reservation')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { emailPayments } = require('../../middleware/emailer/index')
const { serviceSearchOrder } = require('../payOrders/services')
const { serviceGetTotal } = require('../wallet/services')
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (req, res) => {
  try {
    const locale = req.getLocale()
    const customData = req.body
    const idUser = `${req.user._id}`
    req = matchedData(req)
    const payOrder = await serviceSearchOrder(req.id)
    payOrder.customData = customData
    // console.log(customData)
    payOrder.status = customData.status.includes('succe')
      ? 'succeeded'
      : 'failure'
    const { idReservation } = payOrder
    if (idReservation !== null) {
      const reservation = await db.getItem(idReservation, modelReservation)
      const query = { idUser, idReservation }
      const totalPayment = await serviceGetTotal(query)
      const pending = reservation.amount - totalPayment.total
      const sReservation = payOrder.status === 'succeeded' && pending <= 0
        ? 'completed'
        : 'progress'
      await db.updateItem(idReservation, modelReservation, {
        status: sReservation
      })
      const user = await db.getItem(payOrder.idUser, modelUser)
      emailPayments(locale, payOrder, reservation.status, user)
    }
    res
      .status(200)
      .json(await db.updateItem(`${payOrder._id}`, model, payOrder))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { updateItem }
