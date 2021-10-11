const {
  validateGetContractDeparture
} = require('./validateGetContractDeparture')
const { validateGetWallet } = require('./validateGetWallet')
const { valiidateGetAvatar } = require('./valiidateGetAvatar')
const { validateCreateHook } = require('./validateCreateHook')
const { validateDeleteHook } = require('./validateDeleteHook')
const { validateAuthHook } = require('./validateAuthHook')

module.exports = {
  validateGetContractDeparture,
  validateGetWallet,
  valiidateGetAvatar,
  validateCreateHook,
  validateDeleteHook,
  validateAuthHook
}
