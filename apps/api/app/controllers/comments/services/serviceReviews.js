const utils = require('../../../middleware/utils')
const model = require('../../../models/tour')
const { lookupCreator } = require('../../tours/services/lookup')

const serviceReviews = (query) => new Promise(async (resolve, reject) => {
  try {
    const lookupUser = await lookupCreator('creator')
    model
      .aggregate([
        {
          $match: query
        },
        {
          $project: {
            comments: 1,
            _id: 0
          }
        },
        {
          $unwind: '$comments'
        },
        {
          $replaceRoot: {
            newRoot: '$comments'
          }
        },
        lookupUser,
        {
          $project: {
            idUser: 0
          }
        },
        {
          $sort: { dateCreate: -1 }
        },
        {
          $project: {
            idReservation: 0
          }
        }
      ])
      .exec((err, res) => {
        if (res) {
          resolve(res)
        } else {
          reject(utils.buildErrObject(422, 'TOUR_NOT_FIND_OR_EMPTY'))
        }
      })
  } catch (e) {
    console.log(e)
    reject(utils.buildErrObject(422, e.message))
  }
})

module.exports = { serviceReviews }
