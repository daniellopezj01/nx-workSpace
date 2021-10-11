const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')

const { validateGetContracts } = require('../controllers/contracts/validators')
const { getContracts } = require('../controllers/contracts/index')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

router.post(
  '/',
  requireAuth,
  trimRequest.all,
  validateGetContracts,
  getContracts
)

module.exports = router
