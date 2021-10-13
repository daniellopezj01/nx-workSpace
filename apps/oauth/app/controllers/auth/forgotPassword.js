const { matchedData } = require('express-validator')
const {
  findUser,
  forgotPasswordResponse,
  saveForgotPassword
} = require('./helpers')
const { handleError } = require('../../middleware/utils')
const { sendResetPasswordEmailMessage } = require('../../middleware/emailer')
/**
 * Forgot password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const forgotPassword = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    const data = matchedData(req)
    const user = await findUser(data.email)
    const item = await saveForgotPassword(req)
    const object = { ...user._doc, ...item._doc }
    sendResetPasswordEmailMessage(locale, object)
    res.status(200).json(forgotPasswordResponse(object))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { forgotPassword }
