const model = require('../../models/comments')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { serviceGetItemsAdmin } = require('./services')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItemsAdmin = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query, true, false)
    const queryAggregate = await serviceGetItemsAdmin(query)
    const aggregate = model.aggregate(queryAggregate)
    const tours = await db.getItemsAggregate(req, model, aggregate)
    res.status(200).json(tours)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItemsAdmin }
