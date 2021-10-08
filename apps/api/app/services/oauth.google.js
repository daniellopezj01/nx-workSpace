const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

module.exports = (req = {}) => {
  return passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: 'https://app-v3-prod.mochileros.com.mx/callback/google'
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, profile)
      }
    )
  )
}
