const { matchedData } = require('express-validator')
const model = require('../../models/departure')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperSanitizeData } = require('./helpers')
const { helperArrayCurrencies } = require('../settings/helpers')
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
    if (req.payAmount) {
      req = await helperSanitizeData(req)
    }
    const { currencies } = req
    if (currencies) {
      req.currencies = await helperArrayCurrencies()
    }
    res.status(200).json(await db.updateItem(id, model, req))
    // emailTours(locale, id, 'departure')
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { updateItem }
