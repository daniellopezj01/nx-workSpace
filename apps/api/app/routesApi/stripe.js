const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')

const router = express.Router()
require('../../config/passport')

const {
  validateCreateItem,
  validateAgencyCallback
} = require('../controllers/stripe/validators')
const {
  createItem,
  getUrlConnect,
  linkAccountToUser
} = require('../controllers/stripe')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/**
 * @swagger
 * /api/1.0/stripe:
 *    post:
 *      tags:
 *        - stripe
 *      summary: "agregar pago stripe"
 *      description: crear nuevo pago stripe
 *      responses:
 *        '200':
 *          description: Retorna el objeto insertado en la coleccion.
 *        '422':
 *          description: Error de validacion en alguno de los campos ingresados.
 *      parameters:
 *        -  in: "body"
 *           name: "body"
 *           description: "parametros requeridos para hacer pago stripe"
 *           required: true
 *           schema:
 *                $ref: "#/definitions/stripe"
 *    responses:
 *      '201':
 *        description: retorna el objeto insertado en la coleccion
 */
router.post('/', requireAuth, trimRequest.all, validateCreateItem, createItem)

router.get('/agency', requireAuth, trimRequest.all, getUrlConnect)

router.post(
  '/agency-callback',
  requireAuth,
  trimRequest.all,
  validateAgencyCallback,
  linkAccountToUser
)

module.exports = router
