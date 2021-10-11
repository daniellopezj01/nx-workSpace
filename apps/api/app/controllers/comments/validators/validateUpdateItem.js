const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

/**
 * Validates update item request
 */
const validateUpdateItem = [
  check('idReservation')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('content')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('tags')
    .optional(),
  check('status')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .custom((v) => v.toLowerCase() === 'publish' || v.toLowerCase() === 'draft'
      ? v.toLowerCase()
      : v === '')
    .withMessage('ISNOT_VALID_VALUE'),
  check('vote')
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
  check('attachment').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateUpdateItem }
