const queryString = require('query-string')
const utils = require('../../middleware/utils')
const {
  serviceSaveTokenSabre
} = require('./services/servicesAuth/serviceSaveTokenSabre')

const authSabre = () =>
  new Promise(async (resolve, reject) => {
    try {
      // const url = 'https://api-crt.cert.havail.sabre.com/v2/auth/token'
      const url = `${process.env.URL_SABRE}/v2/auth/token`
      const headers = await utils.structureToken(process.env.PASS_SABRE)
      headers['content-type'] = 'application/x-www-form-urlencoded'
      const body = queryString.stringify({ grant_type: 'client_credentials' })
      utils.httpRequest$(url, 'post', headers, body).subscribe(
        async (res) => {
          await serviceSaveTokenSabre(res)
          resolve(res)
        },
        (error) => {
          utils.buildErrObjectReject(error, reject, '422', 'ERROR_AUTH_SABRE')
        }
      )
    } catch (error) {
      utils.buildErrObjectReject(error, reject, '422', 'ERROR_AUTH_SABRE')
    }
  })

module.exports = { authSabre }
