const express = require('express')

const router = express.Router()
const trimRequest = require('trim-request')
const { checkBasic } = require('../middleware/auth')

const { intentPay } = require('../controllers/contracts')
const { getIntention } = require('../controllers/payIntention')

const {
  validatePayIntent,
  validateGetItem
} = require('../controllers/payIntention/validators')

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

/*
 * Get items route
 */
router.post(
  '/getItem/:id',
  trimRequest.all,
  checkBasic,
  validateGetItem,
  getIntention
)

module.exports = router
