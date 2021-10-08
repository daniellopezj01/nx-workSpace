const utils = require('../../../../middleware/utils')

const filterTypeOffered = (exist = false, array = undefined) => new Promise(async (resolve, reject) => {
  try {
    const query = {
      idExternal: {
        $exists: exist !== 'mochileros'
      }
    }
    resolve(array ? [...array, query] : query)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'NOT_FOUND_TYPE_OFFERED')
  }
})

module.exports = { filterTypeOffered }
