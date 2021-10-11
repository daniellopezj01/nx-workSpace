const { check } = require('express-validator')
const { validateResult } = require('../../../middleware/utils')

/**
 * Validates create new item request
 */
const validateAuthHook = [
  check('appId')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('appSecret')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validateAuthHook }
