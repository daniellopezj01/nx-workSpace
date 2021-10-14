const { matchedData } = require('express-validator')
const model = require('../../models/validateFlights')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const {
  serviceRequestValidateSearch
} = require('../../plugins/sabre/services/servicesValidateSearch')
const { helperGetPaymentByCountry } = require('../paymentMethods/helpers')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItem = async (req, res) => {
  try {
    req = matchedData(req)
    const { code } = req
    let info = await db.findOne({ code }, model)
    info = info._doc
    const { params } = info
    const data = await serviceRequestValidateSearch(params, false)
    const pk = await helperGetPaymentByCountry('MX')
    res.status(200).json({
      code,
      ...info,
      ...data,
      pk
    })
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItem }
