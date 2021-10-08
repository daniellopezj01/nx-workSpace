/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const utils = require('../../../../middleware/utils')
const { serviceDepartureManager } = require('../serviceDepartureManager')
const db = require('../../../../middleware/db')
const tourModel = require('../../../../models/tour')
const { serviceDisabledDepartures } = require('./serviceDisabledDepartures')
/**
 * transform all mini tours inside of the main tour
 * @param {*} general  current tour of contiki
 * @param {*} tourList  tours list inside main tour
 * @returns
 */
// transforma todos los mini tours que contiene un viaje.
const serviceCombineMiniTours = (general, tourList) => new Promise(async (resolve, reject) => {
  try {
    tourList = _.chain(tourList)
      .uniqBy((i) => _.head(i.websiteUrls).url)
      .filter((o) => _.head(o.websiteUrls).url).value()
    if (tourList.length) {
      console.log(`******** idTour ${general.id} `)
      for (let i = 0; i < tourList.length; i++) {
        const tourDetails = tourList[i]
        console.log(`******** idTour ${general.id}  --- mini tours: ${tourDetails.id}`)
        const { seasons, id: idOptionTour } = tourDetails
        const { id: idExternal } = general
        await db.findOneBoolean({ idExternal, idOptionTour }, tourModel).then(async (tour) => {
          const isdDepartures = await serviceDepartureManager(seasons, tour)
            .catch((e) => { console.log('departure', e.message) })
          await serviceDisabledDepartures(tour._id, isdDepartures)
        }).catch((err) => {
          console.log('error in search tour ->', err)
        })
      }
      resolve({})
    } else {
      reject('EMPTY_INSIDE_TOUR_LIST_CONTIKI')
    }
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_SCRAPER_CONTIKI')
  }
})

module.exports = { serviceCombineMiniTours }
