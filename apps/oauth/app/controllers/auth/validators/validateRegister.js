const { check } = require('express-validator')
const { validateResult } = require('../../../middleware/utils')

/**
 * Validates register request
 */
const validateRegister = [
  check('name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('surname')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({
      min: 5
    })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  check('userReferred').optional(),
  check('avatar').optional(),
  check('redirect').optional(),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateRegister }
