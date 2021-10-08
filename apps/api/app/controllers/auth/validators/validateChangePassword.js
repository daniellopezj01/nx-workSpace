const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

/**
 * Validates register request
 */
const validateChangePassword = [
  check('accessToken')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateChangePassword }
