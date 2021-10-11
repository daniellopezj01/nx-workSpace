/* eslint-disable radix */
const _ = require('lodash')
const utils = require('../../../middleware/utils')
const model = require('../../../models/conversation')
const { lookupForMembers } = require('./lookup')

const serviceGetItems = (parameters, userId) => new Promise(async (resolve, reject) => {
  try {
    parameters = {
      ...{ to: 5, from: 0, hash: parameters.hash },
      ...parameters
    }
    const lookupMembers = await lookupForMembers()
    model
      .aggregate([
        {
          $match: {
            $and: [
              { hash: parameters.hash },
              {
                members: {
                  $all: [userId]
                }
              }
            ]
          }
        },
        lookupMembers,
        {
          $project: {
            type: 1,
            hash: 1,
            members: '$membersPromise',
            createdAt: 1,
            updatedAt: 1,
            messages: {
              $slice: [
                '$messages',
                parseInt(parameters.from),
                parseInt(parameters.to)
              ]
            }
          }
        }
      ])
      .exec((err, res) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message))
        }
        if (res && res.length) {
          resolve(_.head(res))
        } else {
          reject(utils.buildErrObject(422, 'NOT_FOUND'))
        }
      })
  } catch (e) {
    resolve(utils.buildErrObject(422, e.message))
  }
})

module.exports = { serviceGetItems }
