/* eslint-disable global-require */
const express = require('express')

const router = express.Router()
const fs = require('fs')

const { removeExtensionFromFile } = require('../middleware/utils')

const route = `./apps/api/app/routesApi`

router.use('/', require('./auth'))

fs.readdirSync(route).filter((file) => {
  // Take filename and remove last part (extension)
  const routeFile = removeExtensionFromFile(file)
  // Prevents loading of this file and auth file
  return routeFile !== 'index' && routeFile !== 'auth'
    ? router.use(`/${routeFile}`, require(`./${routeFile}`))
    : ''
})
/*
 * Setup routes for index
 */
router.get('/', (req, res) => {
  res.status(200).json({ message: 'index' })
})
// router.get('/', (req, res) => {
//   res.render('index')
// })

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

// elastic.init(router)
module.exports = router
