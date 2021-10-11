const { matchedData } = require('express-validator')
const model = require('../../models/itinerary')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { serviceNumberItineraries } = require('./services')
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, res) => {
  try {
    req = matchedData(req)
    await utils.isIDGood(req.idTour)
    const sort = await serviceNumberItineraries(req.idTour)
    req.sort = sort.length
    res.status(201).json(await db.createItem(req, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { createItem }
