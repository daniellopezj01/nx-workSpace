const _ = require('lodash')
const db = require('../../../middleware/db')

const modelDeparture = require('../../../models/departure')

const helperGetDepartures = (tours) => new Promise(async (resolve, reject) => {
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
                endDateDeparture: 1,
                startDateDeparture: 1
              }
            }
          ]
          aggregate = modelDeparture.aggregate(aggregate)
          const data = await db.getItemsAggregate({ query: {} }, modelDeparture, aggregate)
          const { docs } = data
          tour.departures = docs
          return tour
        })
      ).catch((err) => {
        console.log('error in call departures', err)
      })
      resolve(tours)
    }
  } catch (error) {
    console.log('error helperGetDepartures', error.message)
    reject(error)
  }
})

module.exports = { helperGetDepartures }
