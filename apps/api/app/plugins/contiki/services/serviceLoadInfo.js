/* eslint-disable func-style */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const { serviceGetDetails } = require('./serviceGetDetails')
const { serviceInsidesTours } = require('./serviceInsidesTours')
const utils = require('../../../middleware/utils')
const db = require('../../../middleware/db')
const modelContinents = require('../../../models/continents')
const modelUser = require('../../../models/user')

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const serviceLoadInfo = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      let continents = await db.getItems(
        { query: { limit: 15 } },
        modelContinents,
        {}
      )
      continents = continents.docs
      const agency = await db.findOne(
        { email: process.env.DEFAULT_EMAIL_AGENCY },
        modelUser
      )
      if (data.length) {
        resolve({ STATUS: 'BEGIN_sCRAPPER' })
        for (let i = 0; i < data.length; i++) {
          const general = data[i]
          // const general = _.find(data, (i) => i.id === 2)
          // if (general.id > 479) {
          const optionTours = await serviceGetDetails(general.id) // trae el detalle de cada Tour de data
          await serviceInsidesTours(general, optionTours, continents, agency) // comienza el proceso de almacenamiento con cada minTour
          await sleep(2000)
        }
        // }
        console.log('el scraper a terminado exitosamente')
      } else {
        reject('EMPTY_DATA_CONTIKI')
      }
    } catch (error) {
      utils.buildErrObjectReject(error, reject, '422', 'ERROR_SCRAPER_CONTIKI')
    }
  })

module.exports = { serviceLoadInfo }
