
const server = require('../superTest')
const auth = require('./testAdmin/auth')
describe('*********** app-test ***********', () => {
  auth.authAdmin(server)
})
