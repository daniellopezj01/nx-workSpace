/* eslint-disable no-underscore-dangle */
const _ = require('lodash')
const facebookProvider = require('../../service/ouathSocialNetworks/oauth.facebook')
const { helperFindByEmail } = require('./helpers')
const machineModel = require('../../models/machines')
const { findOne } = require('../../middleware/db')
const { getAvatar } = require('../hooks')

/**
 * Login Facebook Callback
 */
const loginCbFb = async (req, res, next) => {
  const { cookies } = req
  const { tenant, redirect } = cookies // aqui sabemos a donde redirecionar
  const machine = await findOne({ appId: tenant }, machineModel)
  const urlRedirect = redirect || machine.urlRedirect
  return facebookProvider(req).authenticate(
    'facebook',
    { failureRedirect: '/' },
    async (rq, rs) => {
      if (!rq) {
        const { emails, name } = rs
        const dataJson = rs._json // picture
        const emailsArray = _.map(emails, 'value')
        let avatar = dataJson && dataJson.picture ? dataJson.picture : ''
        const user = await helperFindByEmail(emailsArray, {
          avatar,
          socialNetwork: [{ provider: 'facebook', id: rs.id }]
        }).catch()
        if (!user) {
          // registro
          avatar = avatar
            ? await getAvatar(avatar, machine)
            : encodeURIComponent(avatar)
          const scopes = [
            `?email=${_.head(emailsArray)}`,
            `&name=${name.givenName}`,
            `&lastName=${name.familyName}`,
            `&avatar=${avatar}`
          ]
          res.redirect(`${urlRedirect}/login${scopes.join('')}`)
        } else {
          // login
          const { accessToken } = user
          res.redirect(`${urlRedirect}?token=${accessToken}`)
        }
      } else {
        res.redirect('/')
      }
    }
  )(req, res, next)
}

module.exports = { loginCbFb }
