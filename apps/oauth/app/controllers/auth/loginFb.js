const facebookProvider = require('../../service/ouathSocialNetworks/oauth.facebook')

const loginFb = (req, res, next) => {
  // ------>>> Guardamos en cookie desde donde nos pidieron el login "app_1.0"
  const { query } = req
  const { tenant, redirect } = query
  if (redirect) {
    const expired = new Date(new Date().getTime() + 60000)
    res.cookie('redirect', redirect, { expire: expired })
  }
  res.cookie('tenant', tenant, { expire: new Date() + 9999 })
  return facebookProvider(req).authenticate('facebook', {
    scope: ['public_profile', 'email']
  })(req, res, next)
}

module.exports = { loginFb }
