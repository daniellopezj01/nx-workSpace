const { matchedData } = require('express-validator')
// const {customFind, getItem} = require('../../middleware/db')
const { helperGenerateBasicAuth } = require('./helpers')
const utils = require('../../middleware/utils')
const { serviceRegisterUserReferred } = require('../referred/services')
const { serviceFindUserOrRegister } = require('./services')

const exchangeToken = async (req, res) => {
  try {
    const data = matchedData(req)
    const { accessToken, userReferred } = data
    const urlOauth = process.env.OAUHT_URL || null
    const baseToken = await helperGenerateBasicAuth()
    const header = {
      'Axios-Redis-Cache-Duration': null,
      Authorization: `Basic ${baseToken}`
    }
    const response$ = await utils
      .httpRequest$(`${urlOauth}/exchange`, 'post', header, { accessToken })
      .toPromise()
    let { user } = response$
    user = { ...user, ...{ accessToken } }
    const registerUser = await serviceFindUserOrRegister(user)
    if (userReferred) {
      await serviceRegisterUserReferred(userReferred, registerUser) // <------------
    }
    res.status(200).json(await serviceFindUserOrRegister(user))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { exchangeToken }
