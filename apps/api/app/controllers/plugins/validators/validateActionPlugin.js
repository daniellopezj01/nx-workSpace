const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

const validateActionPlugin = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('action')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('params').optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateActionPlugin }
