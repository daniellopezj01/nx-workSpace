const utils = require('../../middleware/utils')
const { serviceIteratorTours } = require('./services/serviceUpdateDeparture')

const updateDepartures = () => new Promise(async (resolve, reject) => {
  try {
    const url = 'https://api.ttc.com/brands/contiki'
    const headers = await utils.generateTokenBase64('token', process.env.PASS_CONTIKI)
    utils.httpRequest$(url, 'get', headers).subscribe(
      async (res) => {
        resolve(await serviceIteratorTours(res))
      },
      (error) => {
        utils.buildErrObjectReject(error, reject, '422', 'ERROR_GET_DATA_CONTIKI')
      }
    )
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_GET_DATA_CONTIKI')
  }
})

module.exports = { updateDepartures }
