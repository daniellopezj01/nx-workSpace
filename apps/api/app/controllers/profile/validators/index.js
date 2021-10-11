const { validateUpdateItem } = require('./validateUpdateItem')
const { validateChangePass } = require('./validateChangePass')
const { validateGetPublicProfile } = require('./validateGetPublicProfile')

module.exports = {
  validateChangePass,
  validateUpdateItem,
  validateGetPublicProfile
}
