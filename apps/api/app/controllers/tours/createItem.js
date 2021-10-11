const { matchedData } = require('express-validator')
const model = require('../../models/tour')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperGenereateSlug } = require('./helpers')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, res) => {
  try {
    const { user } = req
    req = matchedData(req)
    if (!req.idUser) {
      req.idUser = user._id
    }
    req.slug = await helperGenereateSlug(req.title)
    req.idUser = req.idUser || user._id
    res.status(201).json(await db.createItem(req, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { createItem }
