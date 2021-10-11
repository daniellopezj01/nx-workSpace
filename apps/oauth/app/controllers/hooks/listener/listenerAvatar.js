/* eslint-disable radix */
/* eslint-disable no-unused-vars */
const { emitterWebHooks } = require('../../../service/hooks')
const { parseJson } = require('../../../middleware/utils')

const listenerAvatar = () => new Promise((resolve, reject) => {
  emitterWebHooks.on('*.success', async (shortName, statusCode, body) => {
    const dataParse = parseJson(body)
    const { smallPath } = dataParse
    resolve(smallPath)
  })
  /**
     * If APIHUB response FAILUER  400, 404 etc
     */
  emitterWebHooks.on('*.failure', (shortName, statusCode, body) => {
    reject({ code: 422, message: 'ERROR_WITH_OAUTH_SERVICE' })
  })
})

module.exports = { listenerAvatar }
