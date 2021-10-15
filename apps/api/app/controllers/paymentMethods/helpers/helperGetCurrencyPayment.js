
const db = require('../../../middleware/db')
const payments = require('../../../models/paymentMethods')
const modelSettings = require('../../../models/settings')
const _ = require('lodash')

const helperGetCurrencyPayment = async (data, general) => new Promise(async (resolve) => {
  const { pk } = data
  const key = process.env.NODE_ENV === 'production' ? 'publicKeyProd' : 'publicKeyTest'
  const object = { [key]: pk }
  const paymentMethod = await db.findOne(object, payments)
  const settings = await db.findCheckSingle(modelSettings)
  let currencies = settings?.currencies
  if (general?.departure) {
    const { departure } = general
    currencies = _.unionBy(departure?.currencies, settings?.currencies, 'name')
  }
  const currency = _.find(currencies, (o) => o?.name === paymentMethod?.currency)
  resolve(currency)
})

module.exports = { helperGetCurrencyPayment }
