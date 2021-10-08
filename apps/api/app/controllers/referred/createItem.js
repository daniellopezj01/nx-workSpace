const { matchedData } = require('express-validator')
const model = require('../../models/referredUsers')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, res) => {
  try {
    const data = matchedData(req)
    const item = await db.createItem(data, model)
    res.status(201).json(item)
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { createItem }
