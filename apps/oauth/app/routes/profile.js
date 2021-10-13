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
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/profile')

const {
  validateUpdateProfile,
  validateChangePassword
} = require('../controllers/profile/validators')

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
 * Update profile route
 */
router.patch(
  '/',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateUpdateProfile,
  updateProfile
)

/*
 * Change password route
 */
router.post(
  '/changePassword',
  checkBasic,
  trimRequest.all,
  validateChangePassword,
  changePassword
)

module.exports = router
