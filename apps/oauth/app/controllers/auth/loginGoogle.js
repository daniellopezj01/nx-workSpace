const googleProvider = require('../../service/ouathSocialNetworks/oauth.google')

const loginGoogle = (req, res, next) => {
  // const data = matchedData(req)
  const { query } = req
  const { tenant, redirect } = query
  if (redirect) {
    const expired = new Date(new Date().getTime() + 60000)
    res.cookie('redirect', redirect, { expire: expired })
  }
  res.cookie('tenant', tenant, { expire: new Date() + 9999 })
  // res.clearCookie('tenant')
  return googleProvider(req).authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })(req, res, next)
}

module.exports = { loginGoogle }
