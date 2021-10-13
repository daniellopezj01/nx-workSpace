const { check } = require('express-validator')
const { validateResult } = require('../../../middleware/utils')

/**
 * Validates create new item request
 */
const validateCreateHook = [
  check('target_url')
    .optional(),
  check('bundle')
    .optional(),
  check('user_id')
    .optional(),
  check('action_trigger')
    .optional(),
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
    validateResult(req, res, next)
  }
]

module.exports = { validateCreateHook }
