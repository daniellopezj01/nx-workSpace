/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const setUserInfo = (req = {}) => {
  return new Promise((resolve) => {
    const user = {
      _id: req._id,
      name: req.name,
      surname: req.surname,
      email: req.email,
      loginAttempts: req.loginAttempts,
      role: req.role,
      video: req.video,
      avatar: req.avatar,
      accessToken: req.accessToken,
      referredCode: req.referredCode
    }
    resolve(user)
  })
}

module.exports = { setUserInfo }
