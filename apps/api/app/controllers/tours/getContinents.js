const db = require('../../middleware/db')
const utils = require('../../middleware/utils')
const modelContinents = require('../../models/continents')

const getContinents = async (req, res) => {
  try {
    const query = await db.checkQueryString(req.query, false)
    res.status(200).json(await db.getItems(req, modelContinents, query))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getContinents }
