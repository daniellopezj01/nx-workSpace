const { check } = require('express-validator')
const _ = require('lodash')
const { validationResult } = require('../../../middleware/utils')

/**
 * Validates update item request
 */
const validateUpdateItem = [
  check('startDateDeparture')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .custom((v) => {
      return _.isDate(new Date(v)) ? v : v === ''
    }),
  check('endDateDeparture')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .custom((v) => {
      return _.isDate(new Date(v)) ? v : v === ''
    }),
  check('stock')
    .optional()
    .exists()
    .withMessage('MISSING')
    .isNumeric()
    .withMessage('ISNOT NUMERIC')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('minStock')
    .optional()
    .exists()
    .withMessage('MISSING')
    .isNumeric()
    .withMessage('ISNOT NUMERIC')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('minAge')
    .optional()
    .exists()
    .withMessage('MISSING')
    .isNumeric()
    .withMessage('ISNOT NUMERIC')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('maxAge')
    .optional()
    .exists()
    .withMessage('MISSING')
    .isNumeric()
    .withMessage('ISNOT NUMERIC')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('normalPrice')
    .optional()
    .exists()
    .withMessage('MISSING')
    .isNumeric()
    .withMessage('ISNOT NUMERIC')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('currencies')
    .optional()
    .exists()
    .withMessage('MISSING')
    .isBoolean()
    .withMessage('ISNOT_BOOLEAN'),
  check('description').optional(),
  check('specialPrice')
    .optional()
    .isNumeric()
    .custom((value, { req }) => {
      if (parseFloat(value) > parseFloat(req.body.normalPrice)) {
        throw new Error('Amount special is LOW')
      }
      return true
    }),
  check('closeDateDeparture')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .custom((v) => {
      return _.isDate(new Date(v)) ? v : v === ''
    }),
  check('flight')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('status')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('payAmount')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not(),
  check('idTour')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('customData').optional(),
  check('infoToReservation').optional(),
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
