/* eslint-disable max-statements */
const _ = require('lodash')
const utils = require('../../../middleware/utils')
const model = require('../../../models/tour')
const {
  lookupBestDeparture,
  lookupScore,
  getItineraries,
  checkIsNotDeleted,
  lookupAgency,
  lookupComments
} = require('./lookup')

const serviceGetItem = (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const lookupDepartures = await lookupBestDeparture()
      const lookComments = await lookupComments('$tags', true)
      // console.log(JSON.stringify(lookComments, null, 2))
      const score = await lookupScore()
      const itinerary = await getItineraries()
      const aggregate = []
      const $orStatus = [{ status: { $ne: 'construction' } }]
      const $and = _.concat([query], await checkIsNotDeleted(), $orStatus)
      const agency = await lookupAgency('agency', '$ownerUser')
      aggregate.push({ $match: { $and } })
      aggregate.push(lookupDepartures)
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
      aggregate.push({
        $addFields: {
          bestDeparture: { $arrayElemAt: ['$departures', 0] }
        }
      })
      aggregate.push(score[0])
      aggregate.push(score[1])
      aggregate.push(agency)
      aggregate.push(itinerary)
      aggregate.push({
        $project: {
          departures: 0,
          dataCategories: 0,
          average: 0
        }
      })
      model.aggregate(aggregate).exec((err, res) => {
        if (err) {
          reject(utils.buildErrObject(422, 'TOUR_NOT_FIND_OR_EMPTY'))
        } else if (res.length) {
          resolve(_.head(res))
        } else {
          reject(utils.buildErrObject(422, 'TOUR_NOT_FIND_OR_EMPTY'))
        }
      })
    } catch (e) {
      reject(utils.buildErrObject(422, e.message))
    }
  })

module.exports = { serviceGetItem }
