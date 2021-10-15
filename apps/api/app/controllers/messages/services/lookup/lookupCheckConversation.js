/* eslint-disable handle-callback-err */
const model = require('../../../../models/conversation')

const lookupCheckConversation = (fromUser, toUser) => new Promise(async (resolve) => {
  try {
    model
      .aggregate([
        {
          $match: {
            $and: [
              { type: 'single' },
              {
                members: {
                  $all: [fromUser, toUser]
                }
              }
            ]
          }
        }
      ])
      .exec((err, res) => {
        if (res && res.length) {
          resolve(res)
        } else {
          resolve(false)
        }
      })
  } catch (e) {
    resolve(false)
  }
})

module.exports = { lookupCheckConversation }
