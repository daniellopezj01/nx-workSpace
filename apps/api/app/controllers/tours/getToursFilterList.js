const modelCategories = require('../../models/category')
const modelContinents = require('../../models/continents')
const db = require('../../middleware/db')
const utils = require('../../middleware/utils')

const getToursFilterList = async (req, res) => {
  try {
    const continents = await db.find({}, modelContinents, '-_id code name')
    const categories = await db.find({}, modelCategories, 'slug name')
    // const dates = await helperFilterDepartures()
    const filters = {
      continents,
      categories
      // dates
    }
    res.status(200).json(filters)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getToursFilterList }
