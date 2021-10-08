const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

/**
 * Validates update item request
 */
const validateUpdateItem = [
  check('name')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('label')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('amountFrom')
    .optional()
    .exists()
    .withMessage('MISSING')
    .isNumeric()
    .withMessage('ISNOT NUMERIC')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('amountTo')
    .optional()
    .exists()
    .withMessage('MISSING')
    .isNumeric()
    .withMessage('ISNOT NUMERIC')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('authenticated').optional(),
  check('customData').optional(),
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateUpdateItem }
