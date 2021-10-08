const mongoose = require('mongoose')
const utils = require('../../../middleware/utils')
const model = require('../../../models/tour')
const { lookupScore, lookupCreator } = require('../../tours/services/lookup')

const serviceGetCommentsForUser = (idUser) => new Promise(async (resolve, reject) => {
  try {
    const score = await lookupScore()
    const userCreator = await lookupCreator(
      'creatorComment',
      '$comments.idUser'
    )
    model
      .aggregate([
        {
          $match: {}
        },
        {
          $project: {
            comments: 1,
            _id: 1,
            title: 1,
            attached: 1,
            numberComents: { $size: '$comments' }
          }
        },
        score[0],
        score[1],
        {
          $unwind: '$comments'
        },
        {
          $project: {
            'comments.idReservation': 0,
            average: 0
          }
        },
        {
          $match: { 'comments.idUser': mongoose.Types.ObjectId(idUser) }
        },
        userCreator
      ])
      .exec((err, res) => {
        if (err) {
          console.log(err.message)
        }
        if (res && res.length) {
          resolve(res)
        } else {
          reject(utils.buildErrObject(422, 'TOUR_NOT_FOUND'))
        }
      })
  } catch (e) {
    console.log(e)
    reject(utils.buildErrObject(422, e.message))
  }
})

module.exports = { serviceGetCommentsForUser }
