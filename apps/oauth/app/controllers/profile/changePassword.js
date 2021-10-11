const { matchedData } = require('express-validator')
const model = require('../../models/user')
const { handleError, buildErrObject } = require('../../middleware/utils')
const { checkPassword } = require('../../middleware/auth')
const { findOne } = require('../../middleware/db')
const { changePasswordInDB } = require('./helpers')

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const changePassword = async (req, res) => {
  try {
    req = matchedData(req)
    const { accessToken } = req
    const user = await findOne({ accessToken }, model)
    const { _id } = user
    const isPasswordMatch = await checkPassword(req.old, user)
    if (!isPasswordMatch) {
      return handleError(res, buildErrObject(409, 'WRONG_PASSWORD'))
    }
    // all ok, proceed to change password
    res.status(200).json(await changePasswordInDB(_id, req))
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { changePassword }
