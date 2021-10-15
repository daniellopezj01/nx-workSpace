/* eslint-disable max-statements */
const _ = require('lodash')
const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const { helperCheckCode } = require('./helpers')
const {
  serviceGetTotal,
  serviceGetTransactions
} = require('../wallet/services')
const { helperSearchPaymentMethod } = require('../paymentMethods/helpers')
const { serviceGetItem } = require('./services')
const db = require('../../middleware/db')
const modelDeparture = require('../../models/departure')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getPayments = async (req, res) => {
  try {
    const { user } = req
    req = matchedData(req)
    const query = await helperCheckCode(req.q)
    query.idUser = user._id
    const reservations = await serviceGetItem(query)
    const reservation = _.head(reservations)
    const {
      _id,
      amount,
      status,
      percentage,
      idTour,
      idDeparture
    } = reservation
    delete query.code
    query.idReservation = _id
    const totalPayment = await serviceGetTotal(query)
    const transactions = await serviceGetTransactions(query)
    const pending = parseFloat((amount - totalPayment.total).toFixed(2))
    const pendingProgress = parseFloat(pending * 100) / parseFloat(amount)
    query.idReservation = null
    const totalWallet = await serviceGetTotal(query)
    const departure = await db.getItem(idDeparture, modelDeparture)
    const data = {
      pending,
      transactions,
      totalPrice: amount,
      status,
      idReservation: _id,
      pendingProgress,
      percentage,
      totalWallet,
      departure,
      totalPayment: Number(Math.trunc(amount * percentage) / 100, 2)
    }
    data.pk = await helperSearchPaymentMethod(idTour)
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getPayments }
