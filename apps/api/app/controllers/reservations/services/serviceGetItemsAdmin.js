const utils = require('../../../middleware/utils')
const { lookupDeparture } = require('./lookup')
const { lookupCreator } = require('../../tours/services/lookup')

const serviceGetItemsAdmin = (query) => new Promise(async (resolve, reject) => {
  try {
    const lookDeparture = await lookupDeparture()
    const lookUser = await lookupCreator('asUser')
    query.deleted = false
    const aggregate = [
      {
        $match: query
      },
      lookDeparture,
      lookUser,
      {
        $project: {
          _id: 1,
          idTour: 1,
          status: 1,
          idDeparture: 1,
          travelerFirstName: 1,
          travelerLastName: 1,
          amount: 1,
          code: 1,
          idUser: 1,
          user: { $arrayElemAt: ['$asUser', 0] },
          departure: { $arrayElemAt: ['$asDeparture', 0] },
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]
    resolve(aggregate)
  } catch (e) {
    console.log(e.message)
    reject(utils.buildErrObject(422, e.message))
  }
})

module.exports = { serviceGetItemsAdmin }
