const model = require('../../models/reservation')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { serviceGetItems } = require('./services')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItems = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query)
    const queryAggregate = await serviceGetItems(query, req.user)
    const aggregate = model.aggregate(queryAggregate)
    const data = await db.getItemsAggregate(req, model, aggregate)
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItems }
