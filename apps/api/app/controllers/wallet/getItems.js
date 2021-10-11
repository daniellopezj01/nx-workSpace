const mongoose = require('mongoose')
const model = require('../../models/payOrder')
const db = require('../../middleware/db')
const utils = require('../../middleware/utils')
const { serviceGetTotal } = require('./services')

const getItems = async (req, res) => {
  try {
    const { user } = req
    const query = {
      idUser: mongoose.Types.ObjectId(user._id),
      idReservation: null,
      externalCode: null
    }
    let allData = await db.getItems(req, model, query)
    query.idReservation = null
    const moneyInWallet = await serviceGetTotal(query)
    const { total } = moneyInWallet
    allData = { ...allData, total }
    res.status(200).json(allData)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItems }
