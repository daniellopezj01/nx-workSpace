const { matchedData } = require('express-validator')
const model = require('../../models/payOrder')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const deleteItem = async (req, res) => {
  try {
    const { user } = req
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    const objectUser = { 'customData.userThatDeleted': user }
    await db.updateItem(id, model, objectUser)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { deleteItem }
