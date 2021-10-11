const { matchedData } = require('express-validator')
const model = require('../../models/reservation')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
/**
 * in this function NOT DELETE but change field deleted to true
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const deleteItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { deleteItem }
