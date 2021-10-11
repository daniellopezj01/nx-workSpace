const { check } = require('express-validator')
const { validateResult } = require('../../../middleware/utils')

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
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateExchange }
