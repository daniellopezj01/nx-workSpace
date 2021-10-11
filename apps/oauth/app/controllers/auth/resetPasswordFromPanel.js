const { matchedData } = require('express-validator')
const { updatePassword } = require('./helpers')
const { findUserByAccessToken } = require('./helpers')
const { handleError } = require('../../middleware/utils')

/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const resetPasswordFromPanel = async (req, res) => {
  try {
    const data = matchedData(req)
    const user = await findUserByAccessToken(data.accessToken)
    const result = await updatePassword(data.password, user)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { resetPasswordFromPanel }
