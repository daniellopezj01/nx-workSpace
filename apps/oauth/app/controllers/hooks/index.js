const { getAvatar } = require('./getAvatar')
const { createHook } = require('./createHook')
const { deleteHook } = require('./deleteHook')
const { authHook } = require('./authHook')

module.exports = {
  createHook,
  deleteHook,
  authHook,
  getAvatar
}
