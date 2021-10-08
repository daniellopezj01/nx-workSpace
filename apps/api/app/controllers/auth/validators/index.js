const { validateForgotPassword } = require('./validateForgotPassword')
const { validateLogin } = require('./validateLogin')
const { validateRegister } = require('./validateRegister')
const { validateResetPassword } = require('./validateResetPassword')
const { validateExchange } = require('./validateExchange')
const { validateChangePassword } = require('./validateChangePassword')
const { validateResetPasswordAdmin } = require('./validateResetPasswordAdmin')
const { validateRegisterAdmin } = require('./validateRegisterAdmin')

module.exports = {
  validateForgotPassword,
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateExchange,
  validateChangePassword,
  validateResetPasswordAdmin,
  validateRegisterAdmin
}
