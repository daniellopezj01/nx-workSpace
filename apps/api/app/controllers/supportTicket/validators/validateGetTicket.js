const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

/**
 * Validates create new item request
 */
const validateGetTicket = [
  check('hash')
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
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateGetTicket }
