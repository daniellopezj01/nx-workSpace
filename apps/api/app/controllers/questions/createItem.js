const { matchedData } = require('express-validator')
const model = require('../../models/questionsReservation')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, res) => {
  try {
    req = matchedData(req)
    res.status(201).json(await db.createItem(req, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { createItem }
