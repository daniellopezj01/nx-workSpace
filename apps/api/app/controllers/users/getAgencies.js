const model = require('../../models/user')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getAgencies = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query, true, false)
    query.$and = [{ accountStripe: { $exists: true } }]
    const data = await db.getItems(req, model, query)
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getAgencies }
