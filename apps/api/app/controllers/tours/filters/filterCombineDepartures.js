const utils = require('../../../middleware/utils')
const { filterPrice, filterAge, filterDates } = require('./singleFilter')

const filterCombineDepartures = (query) => new Promise(async (resolve, reject) => {
  try {
    let and = []
    const match = {}
    const {
      minPrice, maxPrice, minAge, maxAge, minDate, maxDate
    } = query
    if (maxPrice > 0) {
      and = await filterPrice(minPrice, maxPrice, and)
    }
    if (maxAge > 0) {
      and = await filterAge(minAge, maxAge, and)
    }
    if (minDate || maxDate) {
      and = await filterDates(minDate, maxDate, and)
    }
    if (and.length) {
      match.$and = and
    }
    // console.log(JSON.stringify(match, null, 2))
    resolve(match)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'FILTER_COMBINE_DEPARTURES')
  }
})

module.exports = { filterCombineDepartures }
