const model = require('../../../models/reservation')
const utils = require('../../../middleware/utils')
const { lookupDeparture, lookupTour } = require('./lookup')
const { getItineraries } = require('../../tours/services/lookup')

const serviceGetItem = (query) => new Promise(async (resolve, reject) => {
  try {
    const lookDeparture = await lookupDeparture()
    const asTour = await lookupTour()
    const lookitinerary = await getItineraries('$idTour')
    model
      .aggregate([
        {
          $match: query
        },
        asTour,
        lookDeparture,
        lookitinerary,
        {
          $addFields: {
            canUpdate: {
              $lt: [
                '$$NOW',
                {
                  $dateFromString: {
                    dateString: {
                      $arrayElemAt: ['$departure.closeDateDeparture', 0]
                    },
                    format: '%m-%d-%Y'
                  }
                }
              ]
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .exec((err, res) => {
        if (err) {
          console.log(err.message)
          reject(utils.buildErrObject(404, 'NOT_FOUND_RESERVATION'))
        }
        if (res && res.length > 0) {
          resolve(res)
        } else {
          reject(utils.buildErrObject(404, 'NOT_FOUND_RESERVATION'))
        }
      })
  } catch (e) {
    resolve(e)
  }
})

module.exports = { serviceGetItem }
