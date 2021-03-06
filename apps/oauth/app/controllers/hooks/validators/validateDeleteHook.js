const { check } = require('express-validator')
const { validateResult } = require('../../../middleware/utils')

/**
 * Validates create new item request
 */
const validateDeleteHook = [
  check('target_url')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateDeleteHook }
