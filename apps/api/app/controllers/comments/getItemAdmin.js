const { matchedData } = require('express-validator')
const _ = require('lodash')
const model = require('../../models/comments')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperCheckCode } = require('../reservations/helpers')
const { serviceGetItem } = require('./services')
/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItemAdmin = async (req, res) => {
  try {
    const dataParams = matchedData(req)
    const query = await helperCheckCode(dataParams.id)
    const queryAggregate = await serviceGetItem(query)
    const aggregate = model.aggregate(queryAggregate)
    const comments = await db.getItemsAggregate(req, model, aggregate)
    res.status(200).json(_.head(comments.docs))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItemAdmin }
