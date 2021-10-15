const express = require('express')
const trimRequest = require('trim-request')
const { validateGetItem } = require('../controllers/validateFlights/validators')
const { getItem } = require('../controllers/validateFlights')

const router = express.Router()
require('../../config/passport')

router.get('/:code', trimRequest.all, validateGetItem, getItem)

module.exports = router
