const priceDiscount = (normalPrice, total) => {
  const discount = (parseFloat(normalPrice) - parseFloat(total)).toFixed(2)
  return discount
}

module.exports = { priceDiscount }
