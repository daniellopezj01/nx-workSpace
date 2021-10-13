/* eslint-disable camelcase */
// const utils = require('.')
const { buildErrObject } = require('./buildErrObject')
const { handleError } = require('./handleError')
const Machine = require('../../models/machines')

const checkAuthHooks = async (req, res, next) => {
  try {
    const { headers } = req
    const { app_id, app_secret } = headers
    let filter = {
      appId: app_id, appSecret: app_secret, status: 'enabled'
    }
    if (process.env.NODE_ENV === 'production') {
      filter = {
        appId: headers['x-appid'], appSecret: headers['x-appsecret'], status: 'enabled'
      }
    }
    const machine = await Machine.findOne(filter)
    if (machine) {
      req.machine = machine
      next()
    } else {
      handleError(res, buildErrObject(401, 'Unauthorized hooks oauth'))
    }
  } catch (error) {
    handleError(res, error)
  }
}
module.exports = { checkAuthHooks }
