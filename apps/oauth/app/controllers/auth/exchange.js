const { matchedData } = require('express-validator')
const User = require('../../models/user')
const { handleError } = require('../../middleware/utils')

const { findUserByAccessToken } = require('./helpers')

const exchange = async (req, res) => {
  try {
    req = matchedData(req)
    const { accessToken } = req
    const user = await findUserByAccessToken(accessToken, User)
    const body = { user }
    res.status(200).json(body)
  } catch (e) {
    handleError(res, e)
  }
}

module.exports = { exchange }
