const _ = require('lodash')
const model = require('../../../models/tour')
const utils = require('../../../middleware/utils')
const {
  lookupAllDepartures,
  getItineraries,
  lookupCreator,
  lookupCategories,
  lookupAgency
} = require('./lookup')

const serviceGetItemAdmin = (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const lookupDepartures = await lookupAllDepartures('departures', true)
      // const score = await getScoreReviews()
      const categories = await lookupCategories()
      const itinerary = await getItineraries()
      const user = await lookupCreator('manager')
      const agency = await lookupAgency('agency')
      const aggregate = []
      aggregate.push({ $match: query })
      aggregate.push(lookupDepartures)
      aggregate.push(itinerary)
      aggregate.push(user)
      aggregate.push(categories)
      aggregate.push(agency)
      model.aggregate(aggregate).exec((err, res) => {
        if (res && res.length) {
          resolve(_.head(res))
        } else {
          console.log(err.message)
          reject(utils.buildErrObject(422, 'TOUR_NOT_FIND_OR_EMPTY'))
        }
      })
    } catch (e) {
      reject(utils.buildErrObject(422, e.message))
    }
  })

module.exports = { serviceGetItemAdmin }
