const model = require('../../models/conversation')
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
    const data = db.getLookConversations(model, query, req.user)
    const result = await db.getItemsAggregate(req, model, data)
    res.status(200).json(result)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItems }
