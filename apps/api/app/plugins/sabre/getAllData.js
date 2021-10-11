const _ = require('lodash')
const utils = require('../../middleware/utils')
const { serviceStructureParamsAllData, serviceTransformFlightData } = require('./services/serviceBFM')
const { serviceGetTokenSabre } = require('./services/servicesAuth')

const getAllData = (params, destructureData = true) => new Promise(async (resolve, reject) => {
  try {
    const token = await serviceGetTokenSabre()
    const headers = await utils.structureTokenBearer(token)
    const body = await serviceStructureParamsAllData(params)
    const url = `${process.env.URL_SABRE}/v4/offers/shop`
    // const url = 'https://api-crt.cert.havail.sabre.com/v4/offers/shop'
    utils.httpRequest$(url, 'post', headers, body).subscribe(
      async (res) => {
        if (destructureData) {
          const response = {}
          response.params = body
          response.data = await serviceTransformFlightData(res).catch(() => { reject('PROBLEM_LOAD_FLIGHTS') })
          resolve(response)
        } else {
          resolve(_.head(res.groupedItineraryResponse.itineraryGroups))
        }
      },
      (error) => {
        utils.buildErrObjectReject(error, reject, '422', 'ERROR_GET_DATA_SABRE')
      }
    )
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_GET_DATA_SABRE')
  }
})

module.exports = { getAllData }
