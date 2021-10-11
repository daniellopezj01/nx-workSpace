const utils = require('../../../middleware/utils')

const serviceGetDetails = (idTour, onlyLog = false) => new Promise(async (resolve, reject) => {
  try {
    const url = `https://api.ttc.com/brands/contiki/tours/${idTour}`
    const headers = await utils.generateTokenBase64('token', process.env.PASS_CONTIKI)
    utils.httpRequest$(url, 'get', headers).subscribe(
      async (res) => {
        const { tourOptions } = res
        resolve(tourOptions)
      },
      (error) => {
        if (onlyLog) {
          reject(error)
        } else {
          utils.buildErrObjectReject(error, reject, '422', 'ERROR_GET_DETAILS_TOUR_CONTIKI')
        }
      }
    )
  } catch (error) {
    if (onlyLog) {
      reject(error)
    } else {
      utils.buildErrObjectReject(error, reject, '422', 'ERROR_GET_DETAILS_TOUR_CONTIKI')
    }
  }
})

module.exports = { serviceGetDetails }
