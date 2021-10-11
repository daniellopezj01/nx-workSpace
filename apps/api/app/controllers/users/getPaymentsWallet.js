const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const { helperCheckId } = require('./helpers')
const model = require('../../models/payOrder')
const db = require('../../middleware/db')
const { serviceGetTotal } = require('../wallet/services')
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getPaymentsWallet = async (req, res) => {
  try {
    let query = matchedData(req)
    query = await helperCheckId(query.id)
    query.idReservation = null
    query.externalCode = null
    let allData = await db.getItems(req, model, query)
    const moneyInWallet = await serviceGetTotal(query)
    const { total } = moneyInWallet
    allData = { ...allData, total }
    res.status(200).json(allData)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getPaymentsWallet }
