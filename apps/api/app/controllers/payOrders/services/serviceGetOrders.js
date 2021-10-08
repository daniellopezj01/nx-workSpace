const { lookupCreator } = require('../../tours/services/lookup')
const { lookupReservation: lookReservation } = require('./lookup')

const serviceGetOrders = (query) => new Promise(async (resolve, reject) => {
  try {
    const lookupUser = await lookupCreator('creator')
    const lookupReservation = await lookReservation()
    const aggregate = [
      {
        $match: query
      },
      lookupUser,
      lookupReservation
    ]
    resolve(aggregate)
  } catch (e) {
    reject(e)
  }
})

module.exports = { serviceGetOrders }
