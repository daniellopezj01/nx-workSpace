const moment = require('moment')
const utils = require('../../../../middleware/utils')

const filterDates = (minDate, maxDate, array = undefined) => new Promise(async (resolve, reject) => {
  try {
    const currentArray = array || []
    if (minDate) {
      minDate = new Date(moment(minDate, 'DD-MM-YYYY').toISOString())
      currentArray.push({
        start: {
          $gte: minDate
        }
      })
    }
    if (maxDate) {
      maxDate = new Date(moment(maxDate, 'DD-MM-YYYY').toISOString())
      currentArray.push({
        end: {
          $lte: maxDate
        }
      })
    }
    resolve(currentArray)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'NOT_FOUND_DATES_IN_FILTER')
  }
})

module.exports = { filterDates }
