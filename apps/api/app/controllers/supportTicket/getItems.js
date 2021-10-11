const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const { getTicketsReservation } = require('./services')
const db = require('../../middleware/db')
const supportModel = require('../../models/supportTicket')

const getItems = async (req, res) => {
  try {
    const data = matchedData(req)
    const { codeReservation } = data
    const queryAggregate = await getTicketsReservation({ codeReservation })
    const aggregate = supportModel.aggregate(queryAggregate)
    const response = await db.getItemsAggregate(req, supportModel, aggregate)
    res.status(200).json(response)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItems }
