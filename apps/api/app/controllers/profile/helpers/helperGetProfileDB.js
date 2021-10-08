const model = require('../../../models/user')
const utils = require('../../../middleware/utils')

const helperGetProfileDB = async (id) => {
  return new Promise((resolve, reject) => {
    model.findById(id, ' -updatedAt -password -createdAt', (err, user) => {
      utils.itemNotFound(err, user, reject, 'NOT_FOUND')
      resolve(user)
    })
  })
}

module.exports = { helperGetProfileDB }
