const _ = require('lodash')
const db = require('../../../middleware/db')
const modelDeparture = require('../../../models/departure')
const utils = require('../../../middleware/utils')

const helperFilterDepartures = () => new Promise(async (resolve, reject) => {
  try {
    let aggregate = [

      {
        $match: {
          $or: [{ status: 'visible' }, { status: 'OK' }, { status: true }]
        }
      },
      {
        $addFields: {
          parseDate: {
            $dateFromString: {
              dateString: '$startDateDeparture',
              format: '%d-%m-%Y'
            }
          },
          shortDate: {
            $dateToString: {
              format: '%Y-%m-01',
              date: {
                $dateFromString: {
                  dateString: '$startDateDeparture',
                  format: '%d-%m-%Y'
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          shortDate: 1,
          parseDate: 1
        }
      }
    ]
    aggregate = modelDeparture.aggregate(aggregate)
    const data = await db.getItemsAggregate({ query: { limit: 1000000000 } }, modelDeparture, aggregate)
    const { docs } = data
    let dates = []
    _.chain(docs).map((i) => {
      dates.push(i.shortDate)
    }).value()
    dates = _.orderBy(_.uniq(dates))
    resolve(dates)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, 422, 'ERROR_FILTER_DEPARTURES')
  }
})

module.exports = { helperFilterDepartures }
