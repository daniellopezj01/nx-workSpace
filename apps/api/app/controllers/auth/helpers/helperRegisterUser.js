const uuid = require('uuid')
const User = require('../../../models/user')
const ReferredUser = require('../../../models/referredUsers')
const utils = require('../../../middleware/utils')
const db = require('../../../middleware/db')

const findUserByRefCode = (referredCode) => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        referredCode
      },
      (err, item) => {
        utils.itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
        resolve(item)
      }
    )
  })
}

const registerUserReferred = async (codeRef, userTo) => {
  const referredUser = await findUserByRefCode(codeRef)
  const body = {
    userTo: userTo._id,
    userFrom: referredUser._id,
    amountFrom: 1,
    amountTo: 1
  }
  db.createItem(body, ReferredUser)
}

const helperRegisterUser = async (req) => {
  return new Promise((resolve, reject) => {
    req.verification = uuid.v4()
    const user = new User(req)
    user.save((err, item) => {
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      registerUserReferred(req.userReferred, item)
      resolve(item)
    })
  })
}

module.exports = { helperRegisterUser }
