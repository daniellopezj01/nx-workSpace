/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const utils = require('../../../../middleware/utils')
/**
 * transform all mini tours inside of the main tour
 * @param {*} general  current tour of contiki
 * @param {*} tourList  tours list inside main tour
 * @returns
 */
// transforma todos los mini tours que contiene un viaje.
const serviceCheckOutDated = (general, tourList) => new Promise(async (resolve, reject) => {
  try {
    tourList = _.chain(tourList)
      .uniqBy((i) => _.head(i.websiteUrls).url)
      .filter((o) => _.head(o.websiteUrls).url).value()
    if (tourList.length) {
      const items = []
      console.log(`******** idTour ${general.id}  `)
      for (let i = 0; i < tourList.length; i++) {
        const tourDetails = tourList[i]
        // console.log(`******** idTour ${general.id}  --- mini tours: ${tourDetails.id}}`)
        const { id: idOptionTour } = tourDetails
        const { id: idExternal } = general
        items.push({ idExternal, idOptionTour })
      }
      resolve(items)
    } else {
      reject('EMPTY_INSIDE_TOUR_LIST_CONTIKI')
    }
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_SCRAPER_CONTIKI')
  }
})

module.exports = { serviceCheckOutDated }
