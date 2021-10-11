const _ = require('lodash')
const model = require('../../../models/tour')
const utils = require('../../../middleware/utils')
const {
  lookupAllDepartures,
  lookupScore,
  getItineraries,
  checkIsNotDeleted
} = require('./lookup')

const serviceItemDepartures = (query) => new Promise(async (resolve, reject) => {
  try {
    const lookupDepartures = await lookupAllDepartures('departures', true)
    const score = await lookupScore()
    const itinerary = await getItineraries()
    const aggregate = []
    const $orStatus = [{ status: { $ne: 'construction' } }]
    const $and = _.concat([query], await checkIsNotDeleted(), $orStatus)
    aggregate.push({ $match: { $and } })
    aggregate.push(lookupDepartures)
    aggregate.push(itinerary)
    aggregate.push(score[0])
    aggregate.push(score[1])
    aggregate.push({
      $project: {
        comments: 0,
        average: 0
      }
    })
    model.aggregate(aggregate).exec((err, res) => {
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

module.exports = { serviceItemDepartures }
