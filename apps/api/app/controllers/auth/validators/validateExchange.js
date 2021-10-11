const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

/**
 * Validates register request
 */
const validateExchange = [
  check('accessToken')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('userReferred')
    .optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateExchange }
