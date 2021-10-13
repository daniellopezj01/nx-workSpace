const moment = require('moment')

const checkDepartureContract = (contract, price) => {
  try {
    const contractsApply = []
    price = parseFloat(price)
    const originalPrice = price
    const {
      startAt,
      endAt,
      amountDiscount,
      discount,
      allowToAccumulate
    } = contract
    if (discount === 'none') {
      throw new Error('NOT_APPLY_CONTRACT')
    }

    if (amountDiscount < 1) {
      throw new Error('ZERO_AMOUNT')
    }
    /**
     * Check range dates
     */
    if (startAt && endAt) {
      const newEndAt = moment(endAt)
      const newStartAt = moment(startAt)
      if (!moment().isBetween(newStartAt, newEndAt)) {
        throw new Error('NOT_RANGE_DATE')
      }
    }

    /**
     * Apply
     */

    contractsApply.push({
      discount,
      amountDiscount
    })

    if (discount === 'percentage') {
      price = originalPrice - originalPrice * (amountDiscount / 100)
    }

    if (discount === 'amount') {
      price = originalPrice - amountDiscount
    }

    const saveAmount = originalPrice - price

    return {
      allowToAccumulate,
      normalPrice: originalPrice,
      price,
      saveAmount,
      contractsApply
    }
  } catch (e) {
    console.log(e.message)
    return null
  }
}

module.exports = { checkDepartureContract }
