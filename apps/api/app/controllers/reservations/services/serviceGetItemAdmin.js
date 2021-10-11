const model = require('../../../models/reservation')
const utils = require('../../../middleware/utils')
const { lookupDeparture, lookupTour } = require('./lookup')
const { lookupCreator } = require('../../tours/services/lookup')

const serviceGetItemAdmin = (query) => new Promise(async (resolve, reject) => {
  try {
    const lookDeparture = await lookupDeparture()
    const asTour = await lookupTour()
    const lookpUser = await lookupCreator('asUser')
    model
      .aggregate([
        {
          $match: query
        },
        asTour,
        lookDeparture,
        lookpUser,
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
    console.log(e.message)
    resolve(e)
  }
})

module.exports = { serviceGetItemAdmin }
