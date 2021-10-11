const utils = require('../../../middleware/utils')
const { lookupCreator } = require('../../tours/services/lookup')

const serviceGetItem = (query) => new Promise(async (resolve, reject) => {
  try {
    const user = await lookupCreator('userCreator')
    const aggregate = [
      {
        $match: query
      },
      user,
      {
        $project: {
          user: {
            $arrayElemAt: ['$userCreator', 0]
          },
          _id: 1,
          code: 1,
          status: 1,
          content: 1,
          categories: 1,
          customData: 1,
          idReservation: 1,
          createdAt: 1,
          attachment: 1,
          vote: 1,
          tags: 1
        }
      }
    ]
    resolve(aggregate)
  } catch (e) {
    console.log(e.message)
    reject(utils.buildErrObject(422, e.message))
  }
})

module.exports = { serviceGetItem }
