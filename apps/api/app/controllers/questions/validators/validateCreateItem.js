const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')
/**
 * Validates create new item request
 */
const validateCreateItem = [
  check('question')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('specialKey')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateCreateItem }
