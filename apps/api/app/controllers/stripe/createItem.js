const { matchedData } = require('express-validator')
const model = require('../../models/payOrder')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const {
  helperSaveCard,
  helperCreateCustomer,
  helperCreatePayment,
  helperStructureOrder,
  helperStructureWallet,
  helperDescription,
  helperGetAllData,
  helperStructureExternalOrder
} = require('./helpers')

// const modelReservation = require('../../models/reservation')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, res) => {
  try {
    const { user } = req
    const data = matchedData(req)
    await helperCreateCustomer(data.pk, {
      token: data.token,
      email: user.email
    })
      .then(async (customer) => {
        let dataPayOrder
        const {
          amount, reference, operationType, externalCode
        } = data
        await helperSaveCard(customer, user)
        const general = await helperGetAllData(reference)
        const description = await helperDescription(general, data)
        const paymentData = await helperCreatePayment(customer.id, description, data, general)
        if (reference) {
          dataPayOrder = await helperStructureOrder(
            general,
            paymentData,
            user._id,
            amount
          )
        } else if (operationType && externalCode) {
          dataPayOrder = await helperStructureExternalOrder(data, paymentData, user._id)
        } else {
          dataPayOrder = await helperStructureWallet(parseFloat(amount), paymentData, user._id)
        }
        await db.createItem(dataPayOrder, model)
        res.status(201).json(paymentData)
      })
      .catch((err) => {
        utils.handleError(res, { code: 422, message: err.message })
      })
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { createItem }
