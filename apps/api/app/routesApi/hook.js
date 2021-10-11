const express = require('express')
const trimRequest = require('trim-request')

const router = express.Router()
const {
  getContractDeparture,
  getWallet,
  createAvatar,
  createHook,
  deleteHook
} = require('../controllers/hooks/index')
const {
  validateGetContractDeparture,
  validateGetWallet,
  valiidateGetAvatar,
  validateCreateHook,
  validateDeleteHook
} = require('../controllers/hooks/validators')

const { checkHooks } = require('../middleware/checkHooks')
const { checkAuthHooks } = require('../middleware/checkAuthHooks')

/** Cuando el servidor oauth require datos... */
router.post(
  '/departure',
  trimRequest.all,
  checkHooks,
  validateGetContractDeparture,
  getContractDeparture
)

router.post(
  '/wallet',
  trimRequest.all,
  checkHooks,
  validateGetWallet,
  getWallet
)

router.post(
  '/avatar',
  trimRequest.all,
  checkHooks,
  valiidateGetAvatar,
  createAvatar
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
