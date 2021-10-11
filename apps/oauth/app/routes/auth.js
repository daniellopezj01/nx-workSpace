const express = require('express')

const router = express.Router()
const trimRequest = require('trim-request')
const { checkBasic } = require('../middleware/auth')

const {
  exchange,
  register,
  login,
  forgotPassword,
  resetPassword,
  loginCbFb,
  loginFb,
  loginCbGoogle,
  loginGoogle,
  verify,
  resetPasswordFromPanel
} = require('../controllers/auth')

const {
  validateRegister,
  validateExchange,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateVerify
} = require('../controllers/auth/validators')

/*
 * Auth routes
 */

/*
 * Register route
 */
router.post(
  '/register',
  trimRequest.all,
  // checkBasic,
  validateRegister,
  register
)
//
/*
 * Verify route
 */
router.post('/verify', trimRequest.all, validateVerify, verify)

// /*
//  * Forgot password route
//  */
router.post('/forgot', trimRequest.all, validateForgotPassword, forgotPassword)
//
// /*
//  * Reset password route
//  */
router.post('/reset', trimRequest.all, validateResetPassword, resetPassword)
//
// /*
//  * Reset password route
//  */
router.post(
  '/resetPasswordFromAdmin',
  checkBasic,
  trimRequest.all,
  validateResetPassword,
  resetPasswordFromPanel
)

//
// /*
//  * Get new refresh token
//  */
// router.get(
//   '/token',
//   requireAuth,
//   roleAuthorization(['user', 'admin']),
//   trimRequest.all,
//   getRefreshToken
// )

/*
 * Login route
 */
router.post('/login', trimRequest.all, validateLogin,
  // checkBasic,
  login)

router.post('/forgot', trimRequest.all, validateForgotPassword, forgotPassword)

router.post(
  '/exchange',
  trimRequest.all,
  validateExchange,
  checkBasic,
  exchange
)

/*
 * Register facebook route
 */
router.get('/register-facebook', loginFb)
/*
 * Login facebook route
 */
router.get('/login-facebook', loginFb)

/*
 * Login facebook callback route
 */
router.get('/callback/facebook', loginCbFb)

/*
 * Register facebook route
 */
router.get('/register-google', loginGoogle)
/*
 * Login google callback route
 */
router.get('/callback/google', loginCbGoogle)

/*
 * Login gmail route
 */
router.get('/login-google', loginGoogle)

module.exports = router
