/* eslint-disable max-statements */
const _ = require('lodash')
const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const { helperCheckCode } = require('./helpers')
const {
  serviceGetTotal,
  serviceGetTransactions
} = require('../wallet/services')
const { serviceGetItemAdmin } = require('./services')
/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const getItemAdmin = async (req, res) => {
  try {
    req = matchedData(req)
    const query = await helperCheckCode(req.q)
    const reservations = await serviceGetItemAdmin(query)
    const reservation = _.head(reservations)
    const { asTour, asDeparture, asUser } = reservation
    reservation.asTour = _.head(asTour)
    reservation.asDeparture = _.head(asDeparture)
    reservation.asUser = _.head(asUser)
    query.idReservation = reservation._id
    delete query.code
    delete query._id
    reservation.transactions = await serviceGetTransactions(query)
    const totalPayment = await serviceGetTotal(query)
    reservation.pendingAmount = parseFloat(
      (reservation.amount - totalPayment.total).toFixed(2)
    )
    res.status(200).json(reservation)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItemAdmin }
