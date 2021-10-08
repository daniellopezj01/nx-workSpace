const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

/**
 * Validates create new item request
 */
const validateCreateItem = [
  check('hash')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('codeReservation')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('message')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty(),
  check('attachment').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateCreateItem }
