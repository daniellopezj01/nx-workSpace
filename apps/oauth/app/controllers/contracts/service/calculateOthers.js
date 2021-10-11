const _ = require('lodash')
const { calculatePrice } = require('./calculatePrice')
const { priceDiscount } = require('./priceDiscount')

const calculateOthers = (insideContract, originData, returnTotal = false) => {
  const { body } = originData
  const { perUser, perDeparture } = insideContract
  let originalPrice = body.normalPrice || 0
  const amountsHistory = []
  let priceTotal = body.normalPrice || 0

  /**
   * Check if departure has contracts
   */

  if (!_.isEmpty(perDeparture)) {
    const { price, contractsApply } = perDeparture
    const contractSingle = _.head(contractsApply)
    priceTotal = price
    amountsHistory.push({
      type: 'departure',
      originalPrice,
      name: 'Descuento de Salida',
      discount: contractSingle.discount,
      amountDiscount: contractSingle.amountDiscount,
      priceDiscount: priceDiscount(originalPrice, price),
      total: price
    })
    originalPrice = price
  }

  /**
   * Check and calculate contracts per user and per departure
   */

  const newObject = _.map(_.flatMapDeep(perUser), (value) => {
    const { discount, amount, name } = value
    priceTotal = calculatePrice(discount, amount, priceTotal)
    const object = {
      type: 'user',
      originalPrice,
      name,
      discount,
      amountDiscount: amount,
      priceDiscount: priceDiscount(originalPrice, priceTotal),
      total: priceTotal
    }
    originalPrice = priceTotal
    return object
  })

  /**
   * Preload output
   * @type {Array}
   */

  const finalArray = _.flatMapDeep(_.concat(amountsHistory, newObject))

  if (!_.isEmpty(finalArray)) {
    if (!returnTotal) {
      return { history: finalArray }
    }
    const totalAmount = _.last(finalArray)
    return totalAmount.total
  }
  if (!returnTotal) {
    return { history: [] }
  }
  return originalPrice
}

module.exports = { calculateOthers }
