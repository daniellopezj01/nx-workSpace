const { matchedData } = require('express-validator')
const modelUser = require('../../models/user')
const Wallet = require('../../models/payOrder')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')

const getWallet = async (req, res) => {
  try {
    req = matchedData(req)
    const { id } = req
    console.log('consume los hooks getWallet')
    const userData = await db.findOne({ accessToken: id }, modelUser)
    const body = {
      data: await db.getLookWallet(Wallet, {}, userData)
    }
    res.status(200).json(body)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getWallet }
