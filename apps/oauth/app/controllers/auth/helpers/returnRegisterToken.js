const { generateToken } = require('./generateToken')

/**
 * Builds the registration token
 * @param {Object} item - user object that contains created id
 * @param {Object} userInfo - user object
 */
const returnRegisterToken = (
  { _id = '', verification = '' },
  userInfo = {}
) => {
  return new Promise((resolve) => {
    if (process.env.NODE_ENV !== 'production') {
      userInfo.verification = verification
    }
    const accessToken = userInfo.accessToken || null
    delete userInfo.accessToken
    const data = {
      accessToken,
      user: userInfo
    }
    resolve(data)
  })
}

module.exports = { returnRegisterToken }
