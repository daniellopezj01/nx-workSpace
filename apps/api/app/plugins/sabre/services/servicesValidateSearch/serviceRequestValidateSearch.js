// const _ = require('lodash')
const utils = require('../../../../middleware/utils')
const { serviceGetTokenSabre } = require('../servicesAuth/serviceGetTokenSabre')
const {
  serviceStructureParamsValidateSearch
} = require('./serviceStructureParamsValidateSearch')
const {
  serviceTransformFlightData
} = require('../serviceBFM/serviceTransformFlightData')

const serviceRequestValidateSearch = (params, changeParams = true) =>
  new Promise(async (resolve, reject) => {
    try {
      const token = await serviceGetTokenSabre()
      const headers = await utils.structureTokenBearer(token)
      const body = changeParams
        ? await serviceStructureParamsValidateSearch(params)
        : params
      const url = `${process.env.URL_SABRE}/v4/shop/flights/revalidate`
      // const url = 'https://api-crt.cert.havail.sabre.com/v4/shop/flights/revalidate'
      // console.log(JSON.stringify(body, null, 2))
      utils.httpRequest$(url, 'post', headers, body).subscribe(
        async (res) => {
          const response = {}
          response.params = body
          response.data = await serviceTransformFlightData(res, true).catch(
            (e) => {
              console.log(e)
              reject('ERROR_VALIDATE_SEARCH')
            }
          )
          resolve(response)
        },
        (error) => {
          console.log('serviceRequestValidateSearch--->', error.message)
          utils.buildErrObjectReject(
            error,
            reject,
            '422',
            'REQUEST_VALIDATE_SEARCH'
          )
        }
      )
    } catch (error) {
      utils.buildErrObjectReject(
        error,
        reject,
        '422',
        'REQUEST_VALIDATE_SEARCH'
      )
    }
  })

module.exports = { serviceRequestValidateSearch }
