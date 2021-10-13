const payIntention = require('../../../models/payIntention')
const { createItem } = require('../../../middleware/db')

const createPayIntention = async (bodyIntention, req) => {
  try {
    const { payAmount, accessToken, id } = req
    const body = {
      ...bodyIntention,
      percentage: payAmount || 100,
      accessToken,
      idOperation: id,
      totalAmountPercentage: parseFloat(
        bodyIntention.total * (payAmount / 100)
      ).toFixed(2)
    }
    return await createItem(body, payIntention)
  } catch (e) {
    console.log(e.message)
    return null
  }
}

module.exports = { createPayIntention }
