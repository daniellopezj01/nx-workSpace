const utils = require('../../../middleware/utils')

const helperSaveCard = async (data, user) => new Promise((resolve, reject) => {
  user.payment = data
  user.save((err, item) => {
    if (err) {
      console.log(err.message)
    }
    utils.itemNotFound(err, item, reject, 'NOT_FOUND')
    resolve(item)
  })
})

module.exports = { helperSaveCard }
