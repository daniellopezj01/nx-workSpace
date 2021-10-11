const db = require('../../../middleware/db')
const paymentModel = require('../../../models/paymentMethods')
const { createStripe } = require('../../../../config/paymentMethods')

const serviceHandleOAuth = async (code) => new Promise(async (resolve, reject) => {
  const filter = { country: 'MX' }
  const paymentStripe = await db.findOne(filter, paymentModel)
  const { publicKeyProd, publicKeyTest } = paymentStripe
  const pk = process.env.NODE_ENV === 'production' ? publicKeyProd : publicKeyTest
  const stripe = await createStripe(pk)
  stripe.oauth.token({
    grant_type: 'authorization_code',
    code
  }).then(
    (response) => {
      const connectedAccountId = response.stripe_user_id
      resolve(connectedAccountId)
    },
    (err) => {
      reject(err)
    }
  )
})

module.exports = { serviceHandleOAuth }
