const utils = require('../../../../middleware/utils')

const filterLanguaje = (codeLanguaje, array = undefined) => new Promise(async (resolve, reject) => {
  try {
    const query = {
      lenguages: {
        $elemMatch: {
          $eq: codeLanguaje
        }
      }
    }
    resolve(array ? [...array, query] : query)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'NOT_FOUND_LANGUAGE_IN_FILTER')
  }
})

module.exports = { filterLanguaje }
