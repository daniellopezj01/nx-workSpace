/* eslint-disable callback-return */
/* eslint-disable camelcase */
// const utils = require('.')
const utils = require('./utils')
const Hooks = require('../models/hooks')

const checkAuthHooks = async (req, res, next) => {
  try {
    const { headers } = req
    const { app_id, app_secret } = headers
    let filter = {
      appId: app_id,
      appSecret: app_secret,
      status: 'enabled'
    }
    if (process.env.NODE_ENV === 'production') {
      filter = {
        appId: headers['x-appid'],
        appSecret: headers['x-appsecret'],
        status: 'enabled'
      }
    }
    const hooks = await Hooks.findOne(filter)
    if (hooks) {
      req.machine = hooks
      next()
    } else {
      utils.handleError(
        res,
        utils.buildErrObject(401, 'Unauthorized hooks api')
      )
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { checkAuthHooks }
