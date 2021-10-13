/* eslint handle-callback-err: "off"*/
const _ = require('lodash')
const mongoose = require('mongoose')
const model = require('../models/payOrder')
const utils = require('../middleware/utils')

exports.checkParam = (q) =>
  new Promise((resolve) => {
    if (mongoose.Types.ObjectId.isValid(q)) {
      resolve({ idReservation: mongoose.Types.ObjectId(q) })
    } else {
      resolve({ code: q })
    }
  })

exports.getTotal = (query) =>
  new Promise(async (resolve, reject) => {
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

exports.getTransactions = (query) =>
  new Promise(async (resolve, reject) => {
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
