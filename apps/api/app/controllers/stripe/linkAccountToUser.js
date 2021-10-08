const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const { serviceHandleOAuth } = require('./services')
const db = require('../../middleware/db')
const modelUser = require('../../models/user')
const { emailLinkAgency } = require('../../middleware/emailer/index')

const linkAccountToUser = async (req, res) => {
  try {
    const { user } = req
    const locale = req.getLocale()
    req = matchedData(req)
    const { code } = req
    await serviceHandleOAuth(code)
      .then(async (stripeResponse) => {
        user.accountStripe = stripeResponse
        await db.updateItem(user._id, modelUser, user)
        res.status(200).json({
          data: stripeResponse
        })
        emailLinkAgency(locale, user)
      })
      .catch((err) => {
        utils.handleError(res, {
          code: 422,
          message: err.message
        })
      })
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { linkAccountToUser }
