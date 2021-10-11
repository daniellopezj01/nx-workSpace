const utils = require('../../middleware/utils')
const { helperSearchPaymentMethod } = require('./helpers')

const getDefaultItem = async (req, res) => {
  try {
    const pk = await helperSearchPaymentMethod()
    res.status(200).json({ pk })
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getDefaultItem }
