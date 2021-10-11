const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

/**
 * Validates forgot password request
 */
const validateForgotPassword = [
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateForgotPassword }
