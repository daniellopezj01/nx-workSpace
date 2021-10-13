const express = require('express')

const router = express.Router()
const trimRequest = require('trim-request')
const { checkBasic } = require('../middleware/auth')

const { intentPay } = require('../controllers/contracts')

const { validatePayIntent } = require('../controllers/payIntention/validators')

/*
 * Machines routes
 */

/*
 * Get item route
 */
router.post(
  '/pay-intent',
  trimRequest.all,
  checkBasic,
  validatePayIntent,
  intentPay
)

module.exports = router
