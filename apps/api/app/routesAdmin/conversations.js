const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth/index')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

const {
  validateDeleteItem,
  validateGetItem
} = require('../controllers/conversations/validators')

const {
  deleteItem,
  getItem,
  getItems
} = require('../controllers/conversations')

/**
 * @swagger
 * /conversations:
 *    get:
 *      tags:
 *        - conversations
 *      summary: "acceder a todas las conversaciones"
 *      description: Listar todos las conversaciones.
 *      responses:
 *        '200':
 *          description: lista de conversaciones
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getItems
)

/**
 * @swagger
 * /conversations/{id}:
 *    get:
 *      tags:
 *        - conversations
 *      summary: "buscar conversacion por parametro id "
 *      description: "Buscar conversacion por el id"
 *      responses:
 *        '200':
 *          description: Retorna el objeto encontrado por el id
 *        '404':
 *          description: No se encuentra el objeto, mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *      parameters:
 *        - name: id
 *          in: query
 *          description: identificador de la conversacion a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *    responses:
 *      '200':
 *        description: retorna el objeto encontrado por el id, si  no es encontrado retorna err
 */
router.get(
  '/:hash',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetItem,
  getItem
)

/**
 * @swagger
 * /conversations/{id}:
 *    delete:
 *      tags:
 *        - conversations
 *      summary: "eliminar conversacion por parametro id"
 *      description: "eliminar conversacion por el id"
 *      responses:
 *        '200':
 *          description: Mensaje DELETED
 *        '404':
 *          description: No se encuentra el objeto mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *      parameters:
 *        - name: id
 *          in: query
 *          description: identificador de la conversacion a eliminar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *    responses:
 *      '200':
 *        description: mensaje DELETED
 */

router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateDeleteItem,
  deleteItem
)

module.exports = router
