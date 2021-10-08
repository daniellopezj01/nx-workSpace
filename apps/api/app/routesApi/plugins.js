const express = require('express')
const trimRequest = require('trim-request')
const mdCache = require('../middleware/cache')

const { actionForPlugin } = require('../controllers/plugins/index')
const { validateActionPlugin } = require('../controllers/plugins/validators')

const router = express.Router()
require('../../config/passport')

router.get(
  '/:id/events/:action',
  mdCache.cache,
  trimRequest.all,
  validateActionPlugin,
  actionForPlugin
)

/**
 * Es Necesario AMBOS metodos
 */

router.post(
  '/:id/events/:action',
  mdCache.cache,
  trimRequest.all,
  validateActionPlugin,
  actionForPlugin
)

module.exports = router
