const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth/index')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

const {
  createItem,
  updateItem,
  deleteItem,
  getItem,
  getItems,
  getItemPublic,
  getPaymentsWallet,
  getAgencies,
  getReffereals
} = require('../controllers/users/index')

const {
  validateCreateItem,
  validateUpdateItem,
  validateDeleteItem,
  validateGetItem
} = require('../controllers/users/validators')
/*
 * Get items route
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getItems
)
/*
 * Get items route
 */
router.get(
  '/agencies',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getAgencies
)

/*
 * Create new item route
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateCreateItem,
  createItem
)

/*
 * Get item route
 */
router.get(
  '/public/:id',
  trimRequest.all,
  validateGetItem,
  getItemPublic
)

/*
 * Get item route
 */
router.get(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetItem,
  getItem
)

/*
 * Get item route
 */
router.get(
  '/payment/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetItem,
  getPaymentsWallet
)
/*
 * Get item route
 */
router.get(
  '/referreals/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetItem,
  getReffereals
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateUpdateItem,
  updateItem
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateDeleteItem,
  deleteItem
)

module.exports = router
