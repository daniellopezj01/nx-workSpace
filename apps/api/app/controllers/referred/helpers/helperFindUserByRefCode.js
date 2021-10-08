const User = require('../../../models/user')
const utils = require('../../../middleware/utils')

const helperFindUserByRefCode = (referredCode) => {
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

module.exports = { helperFindUserByRefCode }
