/* eslint-disable func-style */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const { serviceGetDetails } = require('../serviceGetDetails')
const utils = require('../../../../middleware/utils')
const { serviceCombineMiniTours } = require('./serviceCombineMiniTours')

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const serviceIteratorTours = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      if (data.length) {
        resolve({ STATUS: 'BEGIN_CRAPPER_DEPARTURES' })
        for (let i = 0; i < data.length; i++) {
          const general = data[i]
          // const general = _.find(data, (i) => i.id === 18)
          // if (general.id < 10) {
          const optionTours = await serviceGetDetails(general.id) // trae el detalle de cada Tour de data
          await serviceCombineMiniTours(general, optionTours) // comienza el proceso de almacenamiento con cada minTour
          await sleep(2000)
          // }
        }
        console.log('el scraper a terminado exitosamente')
      } else {
        reject('EMPTY_DATA_CONTIKI')
      }
    } catch (error) {
      utils.buildErrObjectReject(error, reject, '422', 'ERROR_SCRAPER_CONTIKI')
    }
  })

module.exports = { serviceIteratorTours }
