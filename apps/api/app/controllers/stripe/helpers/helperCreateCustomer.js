// const stripe = require('../../../../config/stripe')
const { createStripe } = require('../../../../config/paymentMethods')

const helperCreateCustomer = async (pk, data) => new Promise(async (resolve, reject) => {
  const stripe = await createStripe(pk)
  stripe.customers
    .create({
      source: data.token,
      email: data.email
    })
    .then(
      (response) => {
        resolve(response)
      },
      (err) => {
        reject(err)
      }
    )
})

module.exports = { helperCreateCustomer }
