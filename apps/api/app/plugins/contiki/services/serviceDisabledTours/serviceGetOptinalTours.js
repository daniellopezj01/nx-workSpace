/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const { serviceGetDetails } = require('../serviceGetDetails')
const utils = require('../../../../middleware/utils')
const { serviceCheckOutDated } = require('./serviceCheckOutDated')
const { serviceDisabledOutDated } = require('./serviceDisabledOutDated')

const serviceGetOptinalTours = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      if (data.length) {
        resolve({ STATUS: 'BEGIN_CRAPPER_DISABLED_TOURS' })
        let allToursContiki = []
        for (let i = 0; i < data.length; i++) {
          const general = data[i]
          // if (general.id > 500) {
          await serviceGetDetails(general.id, true).then(async (res) => {
            const idsOptions = await serviceCheckOutDated(general, res)
            allToursContiki = allToursContiki.concat(idsOptions)
          })
          // }
        }
        await serviceDisabledOutDated(allToursContiki)
        console.log('el scraper a terminado exitosamente')
      } else {
        reject('EMPTY_DATA_CONTIKI')
      }
    } catch (error) {
      utils.buildErrObjectReject(error, reject, '422', 'ERROR_SCRAPER_CONTIKI')
    }
  })

module.exports = { serviceGetOptinalTours }
