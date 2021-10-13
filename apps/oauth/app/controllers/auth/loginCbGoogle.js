/* eslint-disable no-underscore-dangle */
const _ = require('lodash')
const googleProvider = require('../../service/ouathSocialNetworks/oauth.google')
const { helperFindByEmail } = require('./helpers')
const machineModel = require('../../models/machines')
const { findOne } = require('../../middleware/db')

const loginCbGoogle = async (req, res, next) => {
  try {
    const { cookies } = req
    const { tenant, redirect } = cookies // aqui sabemos a donde redirecionar
    let urlRedirect
    const machine = await findOne({ appId: tenant }, machineModel)
    if (redirect) {
      urlRedirect = redirect
    } else {
      // eslint-disable-next-line prefer-destructuring
      urlRedirect = machine.urlRedirect
    }
    return googleProvider(req).authenticate(
      'google',
      { failureRedirect: '/', session: false },
      async (rq, rs) => {
        if (!rq) {
          const { emails, name } = rs
          const dataJson = rs._json // picture
          const emailsArray = _.map(emails, 'value')
          const avatar = dataJson && dataJson.picture ? dataJson.picture : ''
          const user = await helperFindByEmail(emailsArray, {
            avatar,
            socialNetwork: [{ provider: 'google', id: rs.id }]
          })
          if (!user) {
            const scopes = [
              `?email=${_.head(emailsArray)}`,
              `&name=${name.givenName}`,
              `&lastName=${name.familyName}`,
              `&avatar=${encodeURIComponent(avatar)}`
            ]

            res.redirect(`${urlRedirect}/login${scopes.join('')}`)
          } else {
            const { accessToken } = user
            res.redirect(`${urlRedirect}?token=${accessToken}`)
          }
        } else {
          res.redirect('/')
        }
      }
    )(req, res, next)
  } catch (error) {
    console.log(error.message)
    // res.status(422).json({ error: error.message })
  }
}

module.exports = { loginCbGoogle }
