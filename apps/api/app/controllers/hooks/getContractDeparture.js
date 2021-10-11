const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const modelDeparture = require('../../models/departure')

const getContractDeparture = async (req, res) => {
  try {
    req = matchedData(req)
    console.log('consume los hooks getContractDeparture')
    await utils.isIDGood(req.id)
    res.status(200).json(await db.getItem(req.id, modelDeparture))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getContractDeparture }
