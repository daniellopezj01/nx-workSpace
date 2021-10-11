const express = require('express')
const fs = require('fs')

const router = express.Router()
const routesPath = `./apps/oauth/app/routes`
const { removeExtensionFromFile } = require('../middleware/utils')

const { principal } = require('../controllers/auth/index')
const { validatePrincipal } = require('../controllers/auth/validators')
/*
 * Load routes statically and/or dynamically
 */

// Load Auth route
router.use('/', require('./auth'))

// Loop routes path and loads every file as a route except this file and Auth route
fs.readdirSync(routesPath).filter((file) => {
  // Take filename and remove last part (extension)
  const routeFile = removeExtensionFromFile(file)
  // Prevents loading of this file and auth file
  return routeFile !== 'index' && routeFile !== 'auth' && file !== '.DS_Store'
    ? router.use(`/${routeFile}`, require(`./${routeFile}`))
    : ''
})

/*
 * Setup routes for index
 */
router.get('/',
  validatePrincipal,
  principal)

/*
 * Handle 404 error
 */
router.use('*', (req, res) => {
  res.status(404).json({
    errors: {
      msg: 'URL_NOT_FOUND'
    }
  })
})

module.exports = router
