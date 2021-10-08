const { matchedData } = require('express-validator')
const mongoose = require('mongoose')
const model = require('../../models/referredUsers')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { lookuListReferred } = require('./services/lookup')
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getReffereals = async (req, res) => {
  try {
    const { id } = matchedData(req)
    const query = await db.checkQueryString(req.query)
    const structureAggregate = await lookuListReferred({
      ...query,
      ...{ userFrom: mongoose.Types.ObjectId(id) }
    })
    const aggregate = model.aggregate(structureAggregate)
    const response = await db.getItemsAggregate(req, model, aggregate)
    res.status(200).json(response)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getReffereals }
