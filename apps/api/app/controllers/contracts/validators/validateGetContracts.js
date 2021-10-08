const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')
/**
 * Validates create new item request
 */
const validateGetContracts = [
  check('intent')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('payAmount')
    .exists()
    .withMessage('MISSING')
    .isNumeric()
    .withMessage('ISNOT NUMERIC')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
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

module.exports = { validateGetContracts }
