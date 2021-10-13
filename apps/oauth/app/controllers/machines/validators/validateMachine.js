const { validateResult } = require('../../../middleware/utils')
const { check } = require('express-validator')

/**
 * Validates create new item request
 */
const validateMachine = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('signature') // this is hash by jwt token with secret app token
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateMachine }
