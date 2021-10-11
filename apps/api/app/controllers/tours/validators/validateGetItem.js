const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')
/**
 * Validates get item request
 */
const validateGetItem = [
  check('query')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateGetItem }
