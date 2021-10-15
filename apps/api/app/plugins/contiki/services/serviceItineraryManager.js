/* eslint-disable max-statements */
/* eslint-disable no-return-assign */
/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const { serviceItineraryStructure } = require('./serviceItineraryStructure')
const { helpersItineraryNights } = require('../helpers')
const db = require('../../../middleware/db')
const itineraryModel = require('../../../models/itinerary')
const { helperTranslateItinerary } = require('../../deepTranslate/helpers')

const serviceItineraryManager = ({ itinerary }, tour) =>
  new Promise(async (resolve, reject) => {
    try {
      _.map(itinerary, (i) => (i.locationsVisited = _.head(i.locationsVisited)))
      const newItineraries = await helpersItineraryNights(itinerary).catch(
        (e) => {
          console.log('noches', e.message)
        }
      )
      for (let i = 0; i < newItineraries.length; i++) {
        const element = newItineraries[i]
        let newItinerary = await serviceItineraryStructure(element, tour)
        const { idTour, idTourExternal, idOptionTour, itineraryName } =
          newItinerary
        const filter = {
          idTour,
          idTourExternal,
          idOptionTour,
          itineraryName
        }
        if (process.env.KEY_TRANSLATE) {
          newItinerary = await helperTranslateItinerary(newItinerary)
        }
        const checkItinerary = await db.findOneBoolean(filter, itineraryModel)
        if (checkItinerary) {
          await db
            .updateItem(checkItinerary._id, itineraryModel, newItinerary)
            .catch((err) => {
              console.log('error update itinerary', err.message)
            })
        } else {
          await db.createItem(newItinerary, itineraryModel).catch((err) => {
            console.log('error create itinerary', err.message)
          })
        }
      }
      resolve({ MESSAGE: 'SUCCESS_SCRAPER_ITINERARY' })
    } catch (error) {
      reject({ error: 'ERROR_STRUCTURE_ITINERARY' })
    }
  })

module.exports = { serviceItineraryManager }
