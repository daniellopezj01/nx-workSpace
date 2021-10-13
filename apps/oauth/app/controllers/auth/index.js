const { forgotPassword } = require('./forgotPassword')
const { getRefreshToken } = require('./getRefreshToken')
const { login } = require('./login')
const { exchange } = require('./exchange')
const { register } = require('./register')
const { resetPassword } = require('./resetPassword')
const { roleAuthorization } = require('./roleAuthorization')
const { verify } = require('./verify')
const { resetPasswordFromPanel } = require('./resetPasswordFromPanel')
const { loginCbFb } = require('./loginCbFb')
const { loginFb } = require('./loginFb')
const { loginGoogle } = require('./loginGoogle')
const { loginCbGoogle } = require('./loginCbGoogle')
const { principal } = require('./principal')

module.exports = {
  forgotPassword,
  getRefreshToken,
  login,
  exchange,
  register,
  resetPassword,
  roleAuthorization,
  verify,
  loginCbFb,
  loginFb,
  loginGoogle,
  loginCbGoogle,
  resetPasswordFromPanel,
  principal
}
