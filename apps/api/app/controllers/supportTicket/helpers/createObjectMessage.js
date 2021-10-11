const _ = require('lodash')

const createObjectMessage = (message, user) => new Promise((resolve) => {
  const newUser = {
    message,
    creator: _.pick(user, ['name', '_id', 'surname', 'email', 'role'])
  }
  resolve(newUser)
})

module.exports = { createObjectMessage }
