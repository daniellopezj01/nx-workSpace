const { allContracts } = require('./allContracts')
const { allContractsByUser } = require('./allContractsByUser')
const { getHookDeparture } = require('./getHookDeparture')
const { checkDepartureContract } = require('./checkDepartureContract')
const { calculatePrice } = require('./calculatePrice')
const { calculateOthers } = require('./calculateOthers')
const { createPayIntention } = require('./createPayIntention')
const { priceDiscount } = require('./priceDiscount')

module.exports = {
  allContracts,
  allContractsByUser,
  checkDepartureContract,
  getHookDeparture,
  calculatePrice,
  calculateOthers,
  createPayIntention,
  priceDiscount
}
