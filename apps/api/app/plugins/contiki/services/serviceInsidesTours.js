/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const { serviceTourStructure } = require('./serviceTourStructure')
const utils = require('../../../middleware/utils')
/**
 * transform all mini tours inside of the main tour
 * @param {*} general  current tour of contiki
 * @param {*} tourList  tours list inside main tour
 * @returns
 */
// transforma todos los mini tours que contiene un viaje.
const serviceInsidesTours = (general, tourList, continents, agency) => new Promise(async (resolve, reject) => {
  try {
    tourList = _.chain(tourList)
      .uniqBy((i) => _.head(i.websiteUrls).url)
      .filter((o) => _.head(o.websiteUrls).url).value()
    if (tourList.length) {
      console.log(`******** idTour ${general.id} --- mini tours:${tourList.length}`)
      for (let i = 0; i < tourList.length; i++) {
        const tourDetails = tourList[i]
        await serviceTourStructure(general, tourDetails, continents, agency)
          .catch((e) => console.log('error structure', e.message))
      }
      resolve({})
    } else {
      reject('EMPTY_INSIDE_TOUR_LIST_CONTIKI')
    }
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_SCRAPER_CONTIKI')
  }
})

module.exports = { serviceInsidesTours }
