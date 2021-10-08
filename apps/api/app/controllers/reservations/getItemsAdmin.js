const model = require('../../models/reservation')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { serviceGetItemsAdmin } = require('./services')
const { helperStructureGetItemsAdmin } = require('./helpers')
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
    const reservations = await db.getItemsAggregate(req, model, aggregate)
    reservations.docs = await helperStructureGetItemsAdmin(reservations.docs)
    res.status(200).json(reservations)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItemsAdmin }
