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
  validateChangePass,
  validateUpdateItem,
  validateGetPublicProfile
} = require('../controllers/profile/validators')

const {
  getProfile,
  changePassword,
  getPublicProfile,
  updateItem
} = require('../controllers/profile/index')

/*
 * Profile routes
 */

/*
 * Get profile route
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getProfile
)

/*
 * Get profile route
 */
router.get(
  '/public/:id',
  // requireAuth,
  // roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateGetPublicProfile,
  getPublicProfile
)

/*
 * Update profile route
 */
router.patch(
  '/',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateUpdateItem,
  updateItem
)

/*
 * Change password route
 */
router.post(
  '/changePassword',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateChangePass,
  changePassword
)

module.exports = router
