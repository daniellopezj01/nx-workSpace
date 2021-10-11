const utils = require('../../../../middleware/utils')

const filterDuration = (minDuration, maxDuration, array = undefined) => new Promise(async (resolve, reject) => {
  try {
    const currentArray = array || []
    currentArray.push({
      duration: {
        $gte: parseFloat(minDuration)
      }
    })
    currentArray.push({
      duration: {
        $lte: parseFloat(maxDuration)
      }
    })
    resolve(currentArray)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'NOT_FOUND_DURATION_IN_FILTER')
  }
})

module.exports = { filterDuration }
