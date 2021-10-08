const _ = require('lodash')
const model = require('../../../models/payOrder')
const utils = require('../../../middleware/utils')

const serviceGetTotal = (query) => new Promise(async (resolve, reject) => {
  try {
    query.status = 'succeeded'
    model
      .aggregate([
        {
          $match: query
        },
        {
          $project: {
            _id: 0,
            amount: 1
          }
        },
        { $unwind: '$amount' },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        },
        {
          $project: {
            _id: 0,
            total: 1
          }
        }
      ])
      .exec((err, res) => {
        if (err) {
          reject(utils.buildErrObject(422, 'WALLET_TOTAL_NOT_FOUND'))
        }
        resolve(res && res.length ? _.head(res) : { total: 0 })
      })
  } catch (e) {
    resolve(e)
  }
})

module.exports = {
  serviceGetTotal
}
