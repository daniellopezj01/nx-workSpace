const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds user by email
 * @param accessToken
 */
const findUserByAccessToken = (accessToken = '') => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        accessToken
      },
      'password loginAttempts blockExpires name email role verified verification video avatar surname referredCode',
      async (err, item) => {
        try {
          await itemNotFound(err, item, 'USER_DOES_NOT_EXIST')
          resolve(item)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

module.exports = { findUserByAccessToken }
