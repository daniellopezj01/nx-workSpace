const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')

const {
  getItems
} = require('../controllers/referred/index')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/**
 * @swagger
 *  /api/1.0/referreds:
 *    get:
 *      tags:
 *        - referreds
 *      summary: "acceder a todos los referidos"
 *      description: Listar todos los referidos.
 *      responses:
 *        '200':
 *          description: lista de referidos
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 */
router.get(
  '/',
  requireAuth,
  // AuthController.roleAuthorization(['user', 'admin', 'host']),
  trimRequest.all,
  getItems
)

module.exports = router
