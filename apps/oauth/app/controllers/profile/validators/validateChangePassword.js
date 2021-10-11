const { check } = require('express-validator')
const { validateResult } = require('../../../middleware/utils')

/**
 * Validates change password request
 */
const validateChangePassword = [
  check('accessToken').optional().not().isEmpty()
    .withMessage('IS_EMPTY'),
  check('old')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  check('newpass')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateChangePassword }
