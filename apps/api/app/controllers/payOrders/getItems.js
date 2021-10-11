const _ = require('lodash')
const model = require('../../models/payOrder')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { serviceGetOrders } = require('./services')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItems = async (req, res) => {
  try {
    const queryParams = await db.checkQueryString(req.query, true, false)
    const queryAggregate = await serviceGetOrders(queryParams)
    const aggregate = model.aggregate(queryAggregate)
    const data = await db.getItemsAggregate(req, model, aggregate)
    data.docs = _.map(data.docs, (a) => {
      a = _.omit(a, ['customData'])
      a.creator = _.head(a.creator)
      a.reservation = _.head(a.reservation)
      return a
    })
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItems }
