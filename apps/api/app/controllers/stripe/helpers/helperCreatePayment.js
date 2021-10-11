/* eslint-disable camelcase */
/* eslint-disable radix */
const { createStripe } = require('../../../../config/paymentMethods')
const { helperCreatePayIntention } = require('./helperCreatePayIntention')
const { helperGetCurrencyPayment } = require('../../paymentMethods/helpers')

const helperCreatePayment = async (customer, description, data, general) => new Promise(async (resolve, reject) => {
  const { pk } = data
  const stripe = await createStripe(pk)
  const currency = await helperGetCurrencyPayment(data, general)
  const orderData = await helperCreatePayIntention(customer, description, currency, data)
  stripe.paymentIntents.create(orderData,
    (err, paymentIntent) => {
      if (err) {
        reject(err)
      } else {
        resolve(paymentIntent)
      }
    })
})

module.exports = { helperCreatePayment }
