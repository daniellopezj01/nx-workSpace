const _ = require('lodash')
const mongoose = require('mongoose')
const { matchedData } = require('express-validator')
const model = require('../../models/payOrder')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { serviceGetOrders } = require('./services')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItem = async (req, res) => {
  try {
    const params = matchedData(req)
    const id = await utils.isIDGood(params.id)
    const queryAggregate = await serviceGetOrders({
      _id: mongoose.Types.ObjectId(id)
    })
    const aggregate = model.aggregate(queryAggregate)
    const data = await db.getItemsAggregate(req, model, aggregate)
    let { docs } = data
    docs = _.map(docs, (a) => {
      a = _.omit(a, ['customData'])
      a.creator = _.head(a.creator)
      a.reservation = _.head(a.reservation)
      return a
    })
    res.status(200).json(_.head(docs))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItem }
