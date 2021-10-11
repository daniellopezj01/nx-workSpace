const { matchedData } = require('express-validator')
const _ = require('lodash')
const model = require('../../models/referredUsers')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperCheckCode } = require('../reservations/helpers')
const { serviceGetItemsReffered } = require('./services')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItem = async (req, res) => {
  try {
    const dataParams = matchedData(req)
    const query = await helperCheckCode(dataParams.id)
    const queryAggregate = await serviceGetItemsReffered(query)
    const aggregate = model.aggregate(queryAggregate)
    const referred = await db.getItemsAggregate(req, model, aggregate)
    res.status(200).json(_.head(referred.docs))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItem }
