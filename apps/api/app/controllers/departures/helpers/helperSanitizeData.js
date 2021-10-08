const _ = require('lodash')
const Settings = require('../../../models/settings')
const db = require('../../../middleware/db')

const checkPayAmount = async () => {
  const paymentSettings = await db.findCheckSingle(Settings)
  return paymentSettings
}

const returnOnlyPayment = (inside = [], system = []) => {
  const amounts = _.filter(inside, (i) => system.includes(i.percentageAmount))
  return amounts
}

const helperSanitizeData = async (data) => {
  const system = await checkPayAmount()
  data.payAmount = returnOnlyPayment(data.payAmount, system.payAmount)
  return data
}

module.exports = { helperSanitizeData }
