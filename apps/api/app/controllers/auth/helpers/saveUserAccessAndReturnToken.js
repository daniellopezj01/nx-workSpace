const UserAccess = require('../../../models/userAccess')
const { setUserInfo } = require('./setUserInfo')
const {
  getIP,
  getBrowserInfo,
  getCountry,
  buildErrObject
} = require('../../../middleware/utils')
const { generateToken } = require('./generateToken')

const saveUserAccessAndReturnToken = (req = {}, user = {}) => {
  return new Promise((resolve, reject) => {
    const userAccess = new UserAccess({
      email: user.email,
      ip: getIP(req),
      browser: getBrowserInfo(req),
      country: getCountry(req)
    })
    userAccess.save(async (err) => {
      try {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }
        const userInfo = await setUserInfo(user)
        // Returns data with access token
        resolve({
          token: generateToken(user._id),
          user: userInfo
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { saveUserAccessAndReturnToken }
