const model = require('../../../models/payOrder')
const utils = require('../../../middleware/utils')

const serviceGetTransactions = (query) => new Promise(async (resolve, reject) => {
  try {
    query.deleted = false
    model
      .aggregate([
        {
          $match: query
        },
        {
          $project: {
            customData: 0
          }
        },
        { $sort: { createdAt: -1 } }
      ])
      .exec((err, res) => {
        if (err) {
          reject(utils.buildErrObject(422, 'WALLET_TRANSACTION_NOT_FOUND'))
        }
        if (res && res.length) {
          resolve(res)
        } else {
          resolve([])
        }
      })
  } catch (e) {
    console.log(e.message)
    resolve(e)
  }
})

module.exports = { serviceGetTransactions }
