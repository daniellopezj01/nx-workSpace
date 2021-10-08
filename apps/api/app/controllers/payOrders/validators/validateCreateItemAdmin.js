const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')
/**
 * Validates create new item request
 */
const validateCreateItemAdmin = [
  check('status')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('idOperation')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('idUser')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('amount')
    .exists()
    .withMessage('MISSING')
    .isNumeric()
    .withMessage('ISNOT NUMERIC')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('idReservation')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('platform')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('attached').optional(),
  check('description')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('authenticated').optional(),
  check('customData').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateCreateItemAdmin }
