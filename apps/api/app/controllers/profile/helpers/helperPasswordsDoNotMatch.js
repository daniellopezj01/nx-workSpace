const utils = require('../../../middleware/utils')

const helperPasswordsDoNotMatch = async () => {
  return new Promise((resolve) => {
    resolve(utils.buildErrObject(409, 'WRONG_PASSWORD'))
  })
}

module.exports = { helperPasswordsDoNotMatch }
