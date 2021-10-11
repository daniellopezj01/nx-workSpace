const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const { helperCheckKey } = require('./helpers/index')
const { serviceGetItem } = require('./services')
/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItem = async (req, res) => {
  try {
    req = matchedData(req)
    const query = await helperCheckKey(req.query)
    const tour = await serviceGetItem(query)
    res.status(200).json(tour)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItem }
