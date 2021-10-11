const utils = require('../../../../middleware/utils')

const filterAge = (minAge = 18, maxAge, array = undefined) => new Promise(async (resolve, reject) => {
  try {
    const currentArray = array || []
    currentArray.push({
      minAge: {
        $gte: parseFloat(minAge)
      }
    })
    currentArray.push({
      maxAge: {
        $lte: parseFloat(maxAge)
      }
    })
    resolve(currentArray)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'NOT_FOUND_AGE_IN_FILTER')
  }
})

module.exports = { filterAge }
