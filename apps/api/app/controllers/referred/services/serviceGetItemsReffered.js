const utils = require('../../../middleware/utils')
const { lookupCreator } = require('../../tours/services/lookup')
const { lookupGetPlan } = require('./lookup')

const serviceGetItemsReffered = (query) => new Promise(async (resolve, reject) => {
  try {
    const lookupFrom = await lookupCreator('userFrom', '$userFrom')
    const lookupTo = await lookupCreator('userTo', '$userTo')
    const lookupPlan = await lookupGetPlan()
    const aggregate = [
      {
        $match: query
      },
      lookupFrom,
      lookupTo,
      lookupPlan,
      {
        $project: {
          userTo: {
            $arrayElemAt: ['$userTo', 0]
          },
          userFrom: {
            $arrayElemAt: ['$userFrom', 0]
          },
          plan: {
            $arrayElemAt: ['$plan', 0]
          },
          _id: 1,
          status: 1,
          amountFrom: 1,
          amountTo: 1,
          planReferred: 1,
          code: 1,
          createdAt: 1
        }
      }
    ]
    resolve(aggregate)
  } catch (e) {
    console.log(e.message)
    reject(utils.buildErrObject(422, e.message))
  }
})

module.exports = { serviceGetItemsReffered }
