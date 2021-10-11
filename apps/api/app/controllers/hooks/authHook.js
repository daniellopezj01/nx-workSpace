const { matchedData } = require('express-validator')
const { handleError, buildErrObject } = require('../../middleware/utils')
const Machine = require('../../models/hooks')

/**
 * Check App Secret
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const authHook = async (req, res) => {
  try {
    req = matchedData(req)
    const { appId, appSecret } = req
    const auth = await Machine.findOne({
      appId, appSecret, status: 'enabled'
    })
    if (!auth) {
      handleError(res, buildErrObject(401, 'Unauthorized auth hook'))
    } else {
      res.status(200).json({ Conecction: 'success' })
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { authHook }
