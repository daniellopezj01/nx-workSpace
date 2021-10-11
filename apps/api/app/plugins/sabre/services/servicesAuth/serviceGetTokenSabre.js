/* eslint-disable camelcase */
const fs = require('fs')
const utils = require('../../../../middleware/utils')
const { authSabre } = require('../../authSabre')

const serviceGetTokenSabre = () => new Promise(async (resolve, reject) => {
  try {
    const name = './public/tmp/sabre.json'
    const rawdata = fs.readFileSync(name)
    const data = JSON.parse(rawdata)
    const { access_token: token } = data
    resolve(token)
  } catch (error) {
    const data = await authSabre().catch((err) => {
      utils.buildErrObjectReject(err, reject, '422', 'GET_TOKEN_SABRE')
    })
    const { access_token: token } = data
    resolve(token)
  }
})

module.exports = { serviceGetTokenSabre }
