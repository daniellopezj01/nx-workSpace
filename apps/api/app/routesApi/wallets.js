const express = require('express')

const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const trimRequest = require('trim-request')
// const controller = require('../controllers/wallet')
const { getItems } = require('../controllers/wallet/index')
// const { validateUpdateItem } = require('../controllers/wallet/validators')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/**
 * @swagger
 * /api/1.0/wallets:
 *    get:
 *      tags:
 *        - wallets
 *      summary: "acceder a billetera"
 *      description: Listar monto en billetera .
 *      responses:
 *        '200':
 *          description: monto en billetera
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 */
router.get('/', requireAuth, trimRequest.all, getItems)

module.exports = router
