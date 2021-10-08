const _ = require('lodash')
const { matchedData } = require('express-validator')
const { helperCheckKey, helperPercentages } = require('./helpers')
const { serviceGetItemAdmin } = require('./services')
const utils = require('../../middleware/utils')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItemAdmin = async (req, res) => {
  try {
    req = matchedData(req)
    const query = await helperCheckKey(req.query)
    const tour = await serviceGetItemAdmin(query)
    tour.manager = _.head(tour.manager)
    tour.agency = _.head(tour.agency)
    tour.setting = await helperPercentages()
    res.status(200).json(tour)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItemAdmin }
