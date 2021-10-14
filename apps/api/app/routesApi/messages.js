const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

const { createItem } = require('../controllers/messages/index')

const { validateCreateItem } = require('../controllers/messages/validators')

/**
 * @swagger
 * /api/1.0/messages/{hash}:
 *    post:
 *      tags:
 *        - messages
 *      summary: "enviar mensaje"
 *      description: enviar mensaje en una conversacion existente
 *      responses:
 *        '200':
 *          description: Retorna el objeto insertado en la coleccion.
 *        '422':
 *          description: Error en los parametros o No se encuentra el objeto.
 *    parameters:
 *      -  name: hash
 *         in: path
 *         description: hash de la conversación
 *         required: true
 *         schema:
 *          type: string
 *          format: string
 *      -  name: "body"
 *         in: "body"
 *         description: "parametros requeridos para insertar usuario"
 *         required: true
 *         schema:
 *            $ref: "#/definitions/conversation"
 *    responses:
 *      '201':
 *        description: retorna el objeto insertado en la coleccion
 */
router.post(
  '/:hash',
  requireAuth,
  // AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateCreateItem,
  createItem
)

/**
 * @swagger
 * /api/1.0/messages:
 *    post:
 *      tags:
 *        - messages
 *      summary: "enviar mensaje"
 *      description: enviar nuevo mensaje
 *      responses:
 *        '200':
 *          description: Retorna el objeto insertado en la coleccion.
 *        '422':
 *          description: Error en los parametros.
 *    parameters:
 *      -  name: "body"
 *         in: "body"
 *         description: "parametros requeridos para insertar usuario"
 *         required: true
 *         schema:
 *            $ref: "#/definitions/conversation"
 *    responses:
 *      '201':
 *        description: retorna el objeto insertado en la coleccion
 */
router.post(
  '/',
  requireAuth,
  // AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateCreateItem,
  createItem
)

module.exports = router
