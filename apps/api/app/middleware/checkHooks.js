/* eslint-disable callback-return */
const utils = require('./utils')

const checkHooks = async (req, res, next) => {
  try {
    const { headers } = req
    if (headers.appsecret !== process.env.OAUHT_APP_SECRET) {
      utils.handleError(res, { code: 422, message: 'UNAUTHORIZED_HOOKS' })
    } else {
      next()
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { checkHooks }
