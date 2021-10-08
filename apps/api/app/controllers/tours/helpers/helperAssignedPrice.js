const _ = require('lodash')
const moment = require('moment')
const db = require('../../../middleware/db')

const modelDeparture = require('../../../models/departure')

const helperAssignedPrice = (tours, withAllDepartures = false) => new Promise(async (resolve, reject) => {
  try {
    if (tours.length) {
      await Promise.all(
        _.map(tours, async (tour) => {
          let aggregate = [
            {
              $match: {
                $and: [{
                  idTour: tour._id,
                  $or: [{ status: 'visible' }, { status: 'OK' }, { status: true }]
                }]
              }
            }, {
              $project: {
                _id: 1,
                normalPrice: 1,
                specialPrice: 1,
                startDateDeparture: 1,
                payAmount: 1
              }
            }
          ]
          aggregate = modelDeparture.aggregate(aggregate)
          const data = await db.getItemsAggregate({ query: {} }, modelDeparture, aggregate)
          const { docs } = data
          tour.bestDeparture = _.minBy(docs, 'normalPrice')
          if (withAllDepartures) {
            tour.allDepartures = _.chain(docs).map((i) => {
              i.shortDate = moment(i.startDateDeparture, 'DD-MM-YYYY').format(
                'YYYY-MM-01'
              )
              return i
            }).value()
          }
          return tour
        })
      ).catch((err) => {
        console.log('error in call departures', err)
      })
      resolve(tours)
      // resolve(_.filter(tours, (i) => i.bestDeparture))
    }
  } catch (error) {
    console.log('error helperAssignedPrice', error.message)
    reject(error)
  }
})

module.exports = { helperAssignedPrice }
