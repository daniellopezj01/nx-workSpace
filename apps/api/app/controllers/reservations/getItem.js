const _ = require('lodash')
const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const { helperCheckCode } = require('./helpers')
const { helperCheckKey } = require('../tours/helpers')
const { serviceGetItem } = require('./services')
const { serviceGetItem: getTour } = require('../tours/services')
/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItem = async (req, res) => {
  try {
    const { user } = req
    req = matchedData(req)
    const query = await helperCheckCode(req.q)
    query.idUser = user._id
    const reservations = await serviceGetItem(query)
    const reservation = _.head(reservations)
    const queryTour = await helperCheckKey(reservation.idTour)
    reservation.departure = _.head(reservation.asDeparture)
    delete reservation.asDeparture
    reservation.tour = await getTour(queryTour)
    res.status(200).json(reservation)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItem }
