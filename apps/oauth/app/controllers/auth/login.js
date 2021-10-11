const { matchedData } = require('express-validator')
// const {customFind, getItem} = require('../../middleware/db')

const {
  findUser,
  userIsBlocked,
  checkLoginAttemptsAndBlockExpires,
  passwordsDoNotMatch,
  saveLoginAttemptsToDB,
  saveUserAccessAndReturnToken
} = require('./helpers')

const { handleError } = require('../../middleware/utils')
const { checkPassword } = require('../../middleware/auth')

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const login = async (req, res) => {
  try {
    const data = matchedData(req)
    const user = await findUser(data.email, 'accessToken')
    await userIsBlocked(user)
    await checkLoginAttemptsAndBlockExpires(user)
    const isPasswordMatch = await checkPassword(data.password, user)
    if (!isPasswordMatch) {
      handleError(res, await passwordsDoNotMatch(user))
    } else {
      user.loginAttempts = 0
      await saveLoginAttemptsToDB(user)
      const infoLogin = await saveUserAccessAndReturnToken(req, user)
      if (data.redirect) {
        res.redirect(`${data.redirect}?token=${infoLogin.accessToken}`)
      } else {
        res.status(200).json(infoLogin)
      }
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { login }
