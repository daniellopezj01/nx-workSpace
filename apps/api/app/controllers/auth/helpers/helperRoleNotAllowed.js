const utils = require('../../../middleware/utils')

const helperRoleNotAllowed = async () => new Promise((resolve) => {
  resolve(utils.buildErrObject(409, 'NOT_ROLE'))
})

module.exports = { helperRoleNotAllowed }
