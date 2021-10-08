const { matchedData } = require('express-validator')
const model = require('../../models/departure')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperSanitizeData } = require('./helpers')
const { helperArrayCurrencies } = require('../settings/helpers')

/**
 * Create item function called by route
 * IN THIS METHOD  startLocationDeparture AND  endLocationDeparture
 * receive a coordenate [1,1]
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, res) => {
  try {
    req = matchedData(req)
    await utils.isIDGood(req.idTour)
    req = await helperSanitizeData(req)
    const { currencies } = req
    if (currencies) {
      req.currencies = await helperArrayCurrencies()
    }
    const data = await db.createItem(req, model)
    res.status(201).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { createItem }
