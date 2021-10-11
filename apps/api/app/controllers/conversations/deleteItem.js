const { matchedData } = require('express-validator')
const model = require('../../models/conversation')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const deleteItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    const response = await db.deleteItem(id, model)
    res.status(200).json(response)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { deleteItem }
