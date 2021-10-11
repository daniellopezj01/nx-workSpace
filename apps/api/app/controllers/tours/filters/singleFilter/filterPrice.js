const utils = require('../../../../middleware/utils')

const filterPrice = (minPrice = 0, maxPrice, array = undefined) => new Promise(async (resolve, reject) => {
  try {
    const currentArray = array || []
    currentArray.push({
      normalPrice: {
        $gte: parseFloat(minPrice)
      }
    })
    if (maxPrice) {
      currentArray.push({
        normalPrice: {
          $lte: parseFloat(maxPrice)
        }
      })
    }
    resolve(currentArray)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'NOT_FOUND_PRICE_IN_FILTER')
  }
})

module.exports = { filterPrice }
