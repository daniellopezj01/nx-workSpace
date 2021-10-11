const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const supportModel = require('../../models/supportTicket')

const getItem = async (req, res) => {
  try {
    let data = matchedData(req)
    const { id } = data
    if (id) {
      await utils.isIDGood(id)
      data = { _id: id }
    }
    const response = await db.findOne(data, supportModel)
    res.status(200).json(response)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItem }
