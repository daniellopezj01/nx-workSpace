/* eslint-disable handle-callback-err */
/* eslint-disable max-statements */
const _ = require('lodash')
const utils = require('../../../middleware/utils')
const { getItineraries } = require('./lookup/getItineraries')
const { lookupAgency, lookupComments, lookupScore } = require('./lookup')
const modelTour = require('../../../models/tour')

const serviceTourForReservation = (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const itinerary = await getItineraries()
      const agency = await lookupAgency('agency', '$ownerUser')
      const score = await lookupScore()
      const lookComments = await lookupComments('$tags', true)
      const aggregate = []
      aggregate.push({ $match: query })
      aggregate.push(itinerary)
      aggregate.push(agency)
      aggregate.push(lookComments)
      aggregate.push({
        $addFields: {
          comments: {
            $reduce: {
              input: '$allComments',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this.insideComments'] }
            }
          }
        }
      })
      aggregate.push(score[0])
      aggregate.push(score[1])
      aggregate.push({
        $project: {
          included: 0,
          notIncluded: 0,
          comments: 0,
          faq: 0
        }
      })
      modelTour.aggregate(aggregate).exec((err, res) => {
        if (res && res.length) {
          resolve(_.head(res))
        } else {
          reject(utils.buildErrObject(422, 'TOUR_NOT_FIND_OR_EMPTY'))
        }
      })
    } catch (e) {
      console.log(e)
      reject(utils.buildErrObject(422, e.message))
    }
  })

module.exports = { serviceTourForReservation }
