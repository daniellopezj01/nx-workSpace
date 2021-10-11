const { matchedData } = require('express-validator')
const model = require('../../models/blog')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')

const getItemSlug = async (req, res) => {
  try {
    req = matchedData(req)
    const data = await utils.isIDGoodSlug(req.id)
    res
      .status(200)
      .json(
        data.type !== 'id'
          ? await db.getItemBySlug(data.id, model)
          : await db.getItem(data.id, model)
      )
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItemSlug }
