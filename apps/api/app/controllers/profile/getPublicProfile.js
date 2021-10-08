const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const { helperPublicProfile } = require('./helpers')

const getPublicProfile = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    res.status(200).json(await helperPublicProfile(id))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getPublicProfile }
