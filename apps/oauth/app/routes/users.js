const express = require('express')
require('../../config/passport')

const router = express.Router()
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')
const { checkBasic } = require('../middleware/auth')
const { roleAuthorization } = require('../controllers/auth')

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/users')

const {
  validateCreateUser,
  validateGetUser,
  validateUpdateUser,
  validateDeleteUser
} = require('../controllers/users/validators')

/*
 * Users routes
 */

/*
 * Get items route
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['admin', 'user']),
  trimRequest.all,
  getUsers
)

/*
 * Create new item route
 */
router.post('/', checkBasic, trimRequest.all, validateCreateUser, createUser)

/*
 * Get item route
 */
router.get(
  '/:id',
  requireAuth,
  roleAuthorization(['admin', 'user']),
  trimRequest.all,
  validateGetUser,
  getUser
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['admin', 'user']),
  trimRequest.all,
  validateUpdateUser,
  updateUser
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['admin', 'user']),
  trimRequest.all,
  validateDeleteUser,
  deleteUser
)

module.exports = router
