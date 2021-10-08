const model = require('../../../models/user')
const utils = require('../../../middleware/utils')

const helperFindUser = async (id) => {
  return new Promise((resolve, reject) => {
    model.findById(id, 'password email', (err, user) => {
      utils.itemNotFound(err, user, reject, 'USER_DOES_NOT_EXIST')
      resolve(user)
    })
  })
}

module.exports = { helperFindUser }
