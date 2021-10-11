const express = require('express')

const router = express.Router()
const trimRequest = require('trim-request')
const { checkBasic } = require('../middleware/auth')

const { getMachine } = require('../controllers/machines')

const { validateMachine } = require('../controllers/machines/validators')

/*
 * Machines routes
 */

/*
 * Get item route
 */
router.post('/:id', trimRequest.all, checkBasic, validateMachine, getMachine)

module.exports = router
