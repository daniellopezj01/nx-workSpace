/* eslint-disable no-unused-vars */
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

module.exports = (req = {}) => {
  return passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL:
          process.env.NODE_ENV !== 'production'
            ? 'http://localhost:3002/callback/google'
            : 'https://myaccount.mochileros.com.mx/callback/google'
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, profile)
      }
    )
  )
}
