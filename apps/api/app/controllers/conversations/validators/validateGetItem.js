const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

/**
 * Validates get item request
 */
const validateGetItem = [
  check('hash')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('to').optional(),
  check('from').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateGetItem }
