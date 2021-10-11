const passport = require('passport')
const express = require('express')
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth/index')

const router = express.Router()
require('../../config/passport')

const {
  validateGetItem,
  validateCreateItem,
  validateUpdateItem,
  validateDeleteItem
} = require('../controllers/blogs/validators')
const {
  getItems,
  getItemSlug,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/blogs')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/*
 * Users routes
 */

/*
 * Get items route
 */
router.get('/', trimRequest.all, getItems)

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
  '/:id',
  // requireAuth,
  // AuthController.roleAuthorization(['admin', 'user']),
  trimRequest.all,
  validateGetItem,
  getItemSlug
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
