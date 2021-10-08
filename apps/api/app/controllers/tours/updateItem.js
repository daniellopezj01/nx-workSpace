const { matchedData } = require('express-validator')
const model = require('../../models/tour')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
// const { emailTours } = require('../../middleware/emailer/index')
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (req, res) => {
  try {
    // const locale = req.getLocale()
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    const tour = await db.updateItem(id, model, req)
    res.status(200).json(tour)
    // emailTours(locale, id, 'tour')
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { updateItem }
