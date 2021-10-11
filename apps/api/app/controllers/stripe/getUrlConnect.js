const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const paymentModel = require('../../models/paymentMethods')
const { serviceGenerateUrlConnect } = require('./services')

const getUrlConnect = async (req, res) => {
  try {
    const { user } = req
    const filter = { country: 'MX' }
    const paymentStripe = await db.findOne(filter, paymentModel)
    res.status(200).json(await serviceGenerateUrlConnect(user, paymentStripe.idPayment))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getUrlConnect }
