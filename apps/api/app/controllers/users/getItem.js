const { matchedData } = require('express-validator')
const model = require('../../models/user')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { serviceFindPlanUser } = require('../referredSettings/services')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    let user = await db.getItem(id, model)
    const plan = await serviceFindPlanUser(user.typeReferred)
    user = user._doc
    user = {
      ...user,
      plan
    }
    res.status(200).json(user)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItem }
