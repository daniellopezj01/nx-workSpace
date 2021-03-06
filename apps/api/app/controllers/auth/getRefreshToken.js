const {
  getUserIdFromToken,
  findUserById,
  saveUserAccessAndReturnToken
} = require('./helpers')
const utils = require('../../middleware/utils')
const Settings = require('../../models/settings')
const db = require('../../middleware/db')

/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getRefreshToken = async (req, res) => {
  try {
    const tokenEncrypted = req.headers.authorization
      .replace('Bearer ', '')
      .trim()
    let userId = await getUserIdFromToken(tokenEncrypted)
    userId = await utils.isIDGood(userId)
    const user = await findUserById(userId)
    // user = Object.assign(user,{ref})
    const token = await saveUserAccessAndReturnToken(req, user)
    // Removes user info from response
    // delete token.user
    token.settings = await db.findCheckSingle(Settings)
    res.status(200).json(token)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getRefreshToken }
