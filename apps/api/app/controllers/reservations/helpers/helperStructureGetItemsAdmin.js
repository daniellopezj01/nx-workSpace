const _ = require('lodash')
const db = require('../../../middleware/db')
const { lookupAgency } = require('../../tours/services/lookup/lookupAgency')
const modelTour = require('../../../models/tour')

const helperStructureGetItemsAdmin = (reservations) => new Promise(async (resolve, reject) => {
  try {
    if (reservations.length) {
      await Promise.all(
        _.map(reservations, async (reservation) => {
          const agency = await lookupAgency('agency', '$ownerUser')
          let aggregate = [
            {
              $match: {
                _id: reservation.idTour
              }
            },
            agency,
            {
              $project: {
                title: 1,
                agency: { $arrayElemAt: ['$agency', 0] },
                _id: 1
              }
            }
          ]
          aggregate = modelTour.aggregate(aggregate)
          const data = await db.getItemsAggregate({ query: {} }, modelTour, aggregate)
          reservation.tour = _.head(data.docs)
          return reservation
        })
      ).catch((err) => {
        console.log('error first helperStructureGetItemsAdmin ', err)
      })
      resolve(reservations)
    }
  } catch (error) {
    console.log('error helperStructureGetItemsAdmin', error.message)
    reject(error)
  }
})

module.exports = { helperStructureGetItemsAdmin }
