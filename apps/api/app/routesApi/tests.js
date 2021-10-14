const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')
const { roleAuthorization } = require('../controllers/auth/index')

require('../../config/passport')

const router = express.Router()
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const {
  validateCreateItem,
  validateGetItem,
  validateUpdateItem
} = require('../controllers/reservations/validators')
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  getPayments
} = require('../controllers/reservations/index')

router.get('/login', (req, res) => {
  res.status(200).json({
    title: 'Express Login'
  })
})

module.exports = router
