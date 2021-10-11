const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')
/**
 * Validates create new item request
 */
const validateCreateItem = [
  check('hash').optional(),
  check('to')
    .optional()
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('message')
    .custom((value, { req }) => {
      if (!req.params.hash && !req.body.to) {
        throw new Error('Parameter TO missing or HASH missing')
      }
      return true
    })
    .exists(),
  check('attachment').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateCreateItem }
