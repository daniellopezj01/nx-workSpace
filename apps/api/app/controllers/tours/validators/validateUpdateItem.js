const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

const validateUpdateItem = [
  check('title')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('subTitle')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('description')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('idUser').optional(),
  check('route')
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
  check('continent')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('countries')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('cities')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('duration')
    .optional()
    .exists()
    .withMessage('MISSING')
    .isNumeric()
    .withMessage('ISNOT NUMERIC')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('video').optional(),
  check('attached').optional(),
  check('included').optional(),
  check('notIncluded').optional(),
  check('activityOptional').optional(),
  check('faq').optional(),
  check('itinerary').optional(),
  check('customData').optional(),
  check('category').optional(),
  check('tags').optional(),
  check('status').optional(),
  check('specialInfo').optional(),
  check('featured').optional().not().isEmpty().withMessage('IS_EMPTY'),
  check('termsConditions').optional().not().isEmpty().withMessage('IS_EMPTY'),
  check('type').optional().not().isEmpty().withMessage('IS_EMPTY'),
  check('accountAgency').optional(),
  check('paymentMethod')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('status')
    .optional()
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .custom((v) =>
      v.toLowerCase() === 'publish' ||
        v.toLowerCase() === 'draft' ||
        v.toLowerCase() === 'construction'
        ? v.toLowerCase()
        : v === ''
    )
    .withMessage('ISNOT_VALID_VALUE'),
  check('transport').optional(),
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
