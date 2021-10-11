const { validateForgotPassword } = require('./validateForgotPassword')
const { validateLogin } = require('./validateLogin')
const { validateRegister } = require('./validateRegister')
const { validateResetPassword } = require('./validateResetPassword')
const { validateVerify } = require('./validateVerify')
const { validateExchange } = require('./validateExchange')
const { validatePrincipal } = require('./validatePrincipal')

module.exports = {
  validateForgotPassword,
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateVerify,
  validateExchange,
  validatePrincipal
}
