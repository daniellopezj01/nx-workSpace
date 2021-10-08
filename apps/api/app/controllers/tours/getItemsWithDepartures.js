const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const model = require('../../models/tour')
const { helperGetDepartures } = require('./helpers')
const { serviceGetItemsAdmin } = require('./services')
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItemsWithDepartures = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query, true, false)
    const queryAggregate = await serviceGetItemsAdmin(query)
    const aggregate = model.aggregate(queryAggregate)
    const tours = await db.getItemsAggregate(req, model, aggregate, true)
    tours.docs = await helperGetDepartures(tours.docs)
    res.status(200).json(tours)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItemsWithDepartures }
