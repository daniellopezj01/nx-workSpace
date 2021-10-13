const utils = require('.')

const checkHooks = async (req, res, next) => {
  try {
    const { headers } = req
    console.log(headers.appsecret, process.env.OAUHT_APP_SECRET)
    if (headers.appsecret !== process.env.OAUHT_APP_SECRET) {
      utils.handleError(res, { code: 422, message: 'UNAUTHORIZED_HOOKS' })
    }
    next()
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { checkHooks }
