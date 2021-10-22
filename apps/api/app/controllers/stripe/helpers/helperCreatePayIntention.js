/* eslint-disable max-statements */
/* eslint-disable radix */
/* eslint-disable camelcase */
const db = require('../../../middleware/db')
const { helperCheckAgency } = require('./helperCheckAgency')
const settingsModel = require('../../../models/settings')

const parseAmount = (amount) => {
  amount = Number(Math.trunc(parseFloat(amount) * 100), 2)
  amount = amount.toString().split('.').join('')
  amount = parseInt(amount)
  return amount
}

const helperCreatePayIntention = async (customer, description, currency, data) => new Promise(async (resolve) => {
  let { amount } = data
  const { operationType } = data
  const accountAgency = await helperCheckAgency(data?.reference)
  const { value, name: currencyName } = currency
  const setting = await db.findOneBoolean({ key: 'sabreCurrency' }, settingsModel)
  amount = operationType ? Number(parseInt(amount / setting.value.exchangeRateUsed, 10)) : amount * value
  let application_fee_amount = amount * parseFloat(process.env.FEED)
  application_fee_amount += (parseFloat(process.env.SAFE) * 100)
  application_fee_amount = application_fee_amount.toString().split('.').join('')
  const dataTransfer = {
    application_fee_amount,
    transfer_data: {
      destination: accountAgency
    }
  }
  let mainTransfer = {
    amount: parseAmount(amount),
    currency: currencyName,
    customer,
    description,
    payment_method_types: ['card']
  }
  if (accountAgency) {
    mainTransfer = { ...mainTransfer, ...dataTransfer }
  }
  resolve(mainTransfer)
})

module.exports = { helperCreatePayIntention }
