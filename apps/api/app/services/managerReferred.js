const _ = require('lodash')
const mongoose = require('mongoose')
const User = require('../models/user')
const utils = require('../middleware/utils')
const db = require('../middleware/db')

const getUserCreator = (nameField = 'userFrom', key = '$userFrom') => new Promise((resolve) => {
  resolve({
    $lookup: {
      from: 'users',
      let: { idUser: key },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$$idUser', '$_id'] }]
            }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            surname: 1,
            avatar: 1
          }
        }
      ],
      as: nameField
    }
  })
})

const getPlan = (nameField = 'plan', key = '$planReferred') => new Promise((resolve) => {
  resolve({
    $lookup: {
      from: 'referredsettings',
      let: { idPlan: key },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$$idPlan', '$_id'] }]
            }
          }
        }
      ],
      as: nameField
    }
  })
})

exports.checkParam = (q) => new Promise((resolve) => {
  if (mongoose.Types.ObjectId.isValid(q)) {
    resolve({ _id: mongoose.Types.ObjectId(q) })
  } else {
    resolve({ code: q })
  }
})

exports.getItemsReffered = (query) => new Promise(async (resolve, reject) => {
  try {
    const lookupFrom = await getUserCreator()
    const lookupTo = await getUserCreator('userTo', '$userTo')
    const lookupPlan = await getPlan()
    const aggregate = [
      {
        $match: query
      },
      lookupFrom,
      lookupTo,
      lookupPlan,
      {
        $project: {
          userFrom: {
            $arrayElemAt: ['$userFrom', 0]
          },
          userTo: {
            $arrayElemAt: ['$userTo', 0]
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

exports.getDetailByUser = async (id) => {
  return new Promise((resolve) => {
    const data = db.getLookReferred(User, { _id: mongoose.Types.ObjectId(id) })
    data.exec((err, item) => {
      const usr = _.head(item)
      resolve(usr ? usr.ref : null)
    })
  })
}

// exports.getNumber = async (id) => {
//   return new Promise((resolve) => {
//     const data = db.getLookReferredCount(User, {
//       _id: mongoose.Types.ObjectId(id)
//     })
//     data.exec((err, item) => {
//       resolve(_.head(item))
//     })
//   })
// }
