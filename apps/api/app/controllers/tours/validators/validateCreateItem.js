const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')
/**
 * Validates create new item request
 */
const validateCreateItem = [
  check('title')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('subTitle')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('specialInfo')
    .optional(),
  check('description')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('continent')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('lenguages')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('idUser').optional(),
  check('route')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('countries')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('cities')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('duration')
    .exists()
    .withMessage('MISSING')
    .isNumeric()
    .withMessage('ISNOT NUMERIC')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('accountAgency')
    .optional(),
  check('paymentMethod')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('video').optional(),
  check('attached').optional(),
  check('included').optional(),
  check('notIncluded').optional(),
  check('activityOptional').optional(),
  check('customData').optional(),
  check('itinerary').optional(),
  check('faq').optional(),
  check('category')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('tags')
    .optional(),
  check('status')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .custom((v) => v.toLowerCase() === 'publish' || v.toLowerCase() === 'draft' || v.toLowerCase() === 'construction'
      ? v.toLowerCase()
      : v === '')
    .withMessage('ISNOT_VALID_VALUE'),
  check('featured').optional().not().isEmpty()
    .withMessage('IS_EMPTY'),
  check('termsConditions').optional().not().isEmpty()
    .withMessage('IS_EMPTY'),
  check('type')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .custom((v) => v.toLowerCase() === 'departures' || v.toLowerCase() === 'schedules'
      ? v.toLowerCase()
      : v === '')
    .withMessage('ISNOT_VALID_VALUE'),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateCreateItem }
