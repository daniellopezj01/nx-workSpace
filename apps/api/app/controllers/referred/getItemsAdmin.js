const model = require('../../models/referredUsers')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { serviceGetItemsReffered } = require('./services')

const getItemsAdmin = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query, true, false)
    const queryAggregate = await serviceGetItemsReffered(query)
    const aggregate = model.aggregate(queryAggregate)
    const referred = await db.getItemsAggregate(req, model, aggregate)
    res.status(200).json(referred)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItemsAdmin }
