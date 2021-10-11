const calculatePrice = (type, amount, price) => {
  try {
    const originalPrice = parseFloat(price)
    const originalAmount = parseFloat(amount)
    if (type === 'percentage') {
      return originalPrice - originalPrice * (originalAmount / 100) // 5184  - (5184 * )
    }
    if (type === 'amount') {
      return originalPrice - originalAmount
    }
    return null
  } catch (e) {
    return null
  }
}

module.exports = { calculatePrice }
