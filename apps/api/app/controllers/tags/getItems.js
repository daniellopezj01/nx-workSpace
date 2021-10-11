const model = require('../../models/tags')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItems = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query)
    req.query.order = 1
    req.query.sort = 'name'
    req.query.projection = 'name _id'
    const data = await db.getItems(req, model, query)
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItems }
