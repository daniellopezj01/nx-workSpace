const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

const validateDeleteItem = [
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

module.exports = { validateDeleteItem }
