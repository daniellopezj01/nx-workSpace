const utils = require('../../middleware/utils')
const modelValidateFlights = require('../../models/validateFlights')
const db = require('../../middleware/db')
const { serviceStructurePnr } = require('./services/servicesPNR')

const createOrderPnr = (params) => new Promise(async (resolve, reject) => {
  try {
    const { code } = params
    const flightValidate = await db.findOne({ code }, modelValidateFlights)
    const flightOrder = flightValidate._doc
    const paramsPnr = await serviceStructurePnr(flightOrder)
    const object = { ...flightOrder, paramsPnr, ...params }
    const item = await db.updateItem(object._id, modelValidateFlights, object)
    resolve(item)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_GENERATE_PNR_SABRE')
  }
})

module.exports = { createOrderPnr }
