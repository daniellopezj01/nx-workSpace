const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const { helperUpdateProfile } = require('./helpers')

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.user._id)
    req = matchedData(req)
    res.status(200).json(await helperUpdateProfile(req, id))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { updateItem }
