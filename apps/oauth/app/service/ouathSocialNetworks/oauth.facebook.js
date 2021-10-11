/* eslint-disable no-underscore-dangle */
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy

/**
 * Configuracion FACEBOOK ==> https://i.imgur.com/rSCWFoC.png
 * @param req
 * @returns {Authenticator}
 */
module.exports = (req = {}) => {
  // const { cookies } = req
  const loginFlag = !req.path.includes('register')
  return passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_ID,
        clientSecret: process.env.FB_SECRET,
        callbackURL:
          process.env.NODE_ENV !== 'production'
            ? 'http://localhost:3002/callback/facebook'
            : 'https://myaccount.mochileros.com.mx/callback/facebook',
        profileFields: ['id', 'email', 'name', 'picture.type(large)']
      },
      (accessToken, refreshToken, profile, done) => {
        profile._json.picture = profile && profile._json.picture ? profile._json.picture.data.url : ''
        profile.loginFlag = loginFlag
        done(null, profile)
      }
    )
  )
}
