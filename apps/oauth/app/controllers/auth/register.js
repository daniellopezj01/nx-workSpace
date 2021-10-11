const { matchedData } = require('express-validator')

const { registerUser, setUserInfo, returnRegisterToken } = require('./helpers')
const { handleError } = require('../../middleware/utils')
// const { sendRegistrationEmailMessage } = require('../../middleware/emailer')
const { webHooks } = require('../../service/hooks')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    // const locale = req.getLocale()
    req = matchedData(req)
    const item = await registerUser(req)
    const userInfo = await setUserInfo(item)
    webHooks.trigger('user.new', userInfo)
    console.log('Trigger : user.new')
    const response = await returnRegisterToken(item, userInfo)
    // sendRegistrationEmailMessage(locale, item)
    if (req.redirect) {
      res.redirect(`${req.redirect}?token=${response.accessToken}`)
    } else {
      res.status(200).json(response)
    }
    // res.status(201).json(response)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { register }
