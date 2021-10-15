const {
  filterContinent,
  filterQ,
  filterDuration,
  filterLanguaje,
  filterCategories,
  filterTypeOffered
} = require('./singleFilter')
const utils = require('../../../middleware/utils')

// eslint-disable-next-line max-statements
const filterMainSearch = (query) => new Promise(async (resolve, reject) => {
  try {
    const {
      continent, minDuration, maxDuration, category, language, query: q, offeredBy
    } = query
    let or = []
    let and = [{ status: 'publish' }]
    const match = {}
    if (continent) {
      and = await filterContinent(continent, and)
    }
    if (category) {
      and = await filterCategories(category, and)
    }
    if (language) {
      and = await filterLanguaje(language, and)
    }
    if (q) {
      or = await filterQ(q, or)
    }
    if (offeredBy) {
      and = await filterTypeOffered(offeredBy, and)
    }
    if (maxDuration > 0) {
      and = await filterDuration(minDuration, maxDuration, and)
    }
    if (or.length) {
      match.$or = or
    }
    if (and.length) {
      match.$and = and
    }
    // console.log(JSON.stringify(match, null, 2))
    resolve(match)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'NOT_FOUND_CONTINENT_IN_FILTER')
  }
})

module.exports = { filterMainSearch }
