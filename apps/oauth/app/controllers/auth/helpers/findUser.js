const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds user by email
 * @param {string} email - user´s email
 * @param select
 */
const findUser = (email = '', select = '') => {
  return new Promise((resolve, reject) => {
    User.findOne(
      {
        email
      },
      `password loginAttempts blockExpires name email role verified verification video avatar surname referredCode ${select}`,
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

module.exports = { findUser }
