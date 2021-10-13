const express = require('express')

const router = express.Router()
const trimRequest = require('trim-request')
// const { checkBasic } = require('../middleware/auth')

const { createHook, deleteHook, authHook } = require('../controllers/hooks')
const { checkAuthHooks } = require('../middleware/utils')

const { validateCreateHook, validateDeleteHook, validateAuthHook } = require('../controllers/hooks/validators')

/*
 * Hooks routes
 */

/*
 * Create item route
 */
router.post(
  '/',
  trimRequest.all,
  validateAuthHook,
  authHook
)
/*
 * Create item route
 */
router.post(
  '/subscriber',
  trimRequest.all,
  checkAuthHooks,
  validateCreateHook,
  createHook
)
/*
 * Deleted item route
 */
router.delete(
  '/unsubscriber',
  trimRequest.all,
  checkAuthHooks,
  validateDeleteHook,
  deleteHook
)

module.exports = router
