const model = require('../../../models/user')
const utils = require('../../../middleware/utils')

const helperPublicProfile = async (id) => {
  return new Promise((resolve, reject) => {
    model.findById(
      id,
      'name surname avatar video verified createdAt referredCode',
      (err, user) => {
        utils.itemNotFound(err, user, reject, 'NOT_FOUND')
        resolve(user)
      }
    )
  })
}

module.exports = { helperPublicProfile }
