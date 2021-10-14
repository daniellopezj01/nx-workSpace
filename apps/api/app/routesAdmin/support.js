const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')
// const controller = require('../controllers/messages')
const {
  // validateGetTickets,
  validateGetItemAdmin,
  validateCreateItemAdmin
} = require('../controllers/supportTicket/validators')
const {
  // getItems,
  getItem,
  getItemsAdmin,
  createItemAdmin
} = require('../controllers/supportTicket')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

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

router.get('/', requireAuth, trimRequest.all, getItemsAdmin)

router.post(
  '/',
  requireAuth,
  trimRequest.all,
  validateCreateItemAdmin,
  createItemAdmin
)

router.get('/:id', requireAuth, trimRequest.all, validateGetItemAdmin, getItem)

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

module.exports = router
