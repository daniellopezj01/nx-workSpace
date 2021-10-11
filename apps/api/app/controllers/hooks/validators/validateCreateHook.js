const { check } = require('express-validator')
const { validationResult } = require('../../../middleware/utils')

/**
 * Validates create new item request
 */
const validateCreateHook = [
  check('target_url')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('bundle')
    .optional(),
  check('user_id')
    .optional(),
  check('action_trigger')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('extra')
    .optional(),
  check('client_id')
    .optional(),
  check('client_token')
    .optional(),
  check('event')
    .optional(),
  check('action_id')
    .optional(),
  (req, res, next) => {
    validationResult(req, res, next)
  }
]

module.exports = { validateCreateHook }
