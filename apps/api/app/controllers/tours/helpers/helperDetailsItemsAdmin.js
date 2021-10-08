const _ = require('lodash')
const db = require('../../../middleware/db')
const modelUser = require('../../../models/user')

const helperDetailsItemsAdmin = (tours) => new Promise(async (resolve, reject) => {
  try {
    if (tours.length) {
      await Promise.all(
        _.map(tours, async (tour) => {
          let aggregate = [
            {
              $match: {
                _id: tour.idUser
              }
            }
          ]
          aggregate = modelUser.aggregate(aggregate)
          const data = await db.getItemsAggregate({ query: {} }, modelUser, aggregate)
          tour.creator = _.head(data.docs)
          return tour
        })
      ).catch((err) => {
        console.log('error in call departures', err)
      })
      resolve(tours)
    }
  } catch (error) {
    console.log('error filters', error.message)
    reject(error)
  }
})

module.exports = { helperDetailsItemsAdmin }
