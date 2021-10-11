const utils = require('../../../../middleware/utils')

const filterContinent = (codeContinent, array = undefined) => new Promise(async (resolve, reject) => {
  try {
    const query = {
      continent: {
        $elemMatch: {
          $eq: codeContinent
        }
      }
    }
    resolve(array ? [...array, query] : query)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'NOT_FOUND_CONTINENT_IN_FILTER')
  }
})

module.exports = { filterContinent }
