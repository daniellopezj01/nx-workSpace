const { matchedData } = require('express-validator')
const model = require('../../models/itinerary')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperUpdateSort } = require('./helpers')
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    const ids = req.sorts || []
    if (ids.length) {
      helperUpdateSort(ids)
      delete req.sorts
    }
    res.status(200).json(await db.updateItem(id, model, req))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { updateItem }
