const user = require('../../../models/user')

const helperFindByEmail = (emails, data) => {
  return new Promise((resolve) => {
    user.findOneAndUpdate(
      {
        email: { $in: emails }
      },
      data,
      {
        new: true
      },
      (err, item) => {
        resolve(item)
      }
    )
  })
}

module.exports = { helperFindByEmail }
