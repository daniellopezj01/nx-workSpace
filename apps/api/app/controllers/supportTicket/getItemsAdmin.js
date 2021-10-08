const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const supportModel = require('../../models/supportTicket')
const { getAllTicketsAdmin } = require('./services')

const getItemsAdmin = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query, true, false)
    const queryAggregate = await getAllTicketsAdmin(query)
    const aggregate = supportModel.aggregate(queryAggregate)
    const response = await db.getItemsAggregate(req, supportModel, aggregate)
    res.status(200).json(response)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItemsAdmin }
