const model = require('../../../models/tour')
const utils = require('../../../middleware/utils')

const serviceGetTourContinents = () => new Promise(async (resolve, reject) => {
  try {
    model
      .aggregate([
        {
          $match: { status: 'publish' }
        },
        {
          $project: {
            continent: 1
          }
        },
        {
          $unwind: '$continent'
        },
        {
          $group: {
            _id: '$continent',
            count: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            _id: 0,
            code: '$_id',
            count: 1
          }
        },
        {
          $lookup: {
            from: 'continents',
            let: { code: '$code' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$$code', '$code'] }]
                  }
                }
              }
            ],
            as: 'continent'
          }
        }
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

module.exports = { serviceGetTourContinents }
