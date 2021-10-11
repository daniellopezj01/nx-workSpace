const { matchedData } = require('express-validator')
const model = require('../../models/blog')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperBlogExist, helperGenerateSlug } = require('./helpers')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, res) => {
  try {
    const data = matchedData(req)
    const { name, surname, email } = req.user
    data.userCreator = { name, surname, email }
    data.slug = await helperGenerateSlug(data.title)
    const doesBlogExists = await helperBlogExist(data.slug)
    if (!doesBlogExists) {
      res.status(201).json(await db.createItem(data, model))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { createItem }
