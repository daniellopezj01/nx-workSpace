const { matchedData } = require('express-validator')
const model = require('../../models/payOrder')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItemAdmin = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    const data = await db.updateItem(id, model, req)
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { updateItemAdmin }
