const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})
const {
  validateGetItem
} = require('../controllers/conversations/validators')

const { roleAuthorization } = require('../controllers/auth/index')

const {
  getItem,
  getItems
} = require('../controllers/conversations/index')

/**
 * @swagger
 * /api/1.0/conversations:
 *    get:
 *      tags:
 *        - conversations
 *      summary: "acceder a todas las conversaciones"
 *      description: Listar todos las conversaciones.
 *      responses:
 *        '200':
 *          description: lista de conversaciones
 *      '401':
 *        description: 'You do not have necessary permissions for the resource'
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 *      '401':
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getItems
)

/**
 * @swagger
 * /api/1.0/conversations/{hash}:
 *    get:
 *      tags:
 *        - conversations
 *      summary: "buscar conversacion por parametro hash "
 *      description: "Buscar conversacion por el hash"
 *      responses:
 *        '200':
 *          description: Retorna el objeto encontrado por el hash
 *        '422':
 *          description: Error de validacion o No se encuentra el objeto.
 *      '401':
 *        description: 'You do not have necessary permissions for the resource'
 *      parameters:
 *        - name: hash
 *          in: query
 *          description: identificador de la conversacion a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *    responses:
 *      '200':
 *        description: retorna el objeto encontrado por el hash, si  no es encontrado retorna err
 */
router.get(
  '/:hash',
  requireAuth,
  trimRequest.all,
  validateGetItem,
  getItem
)

module.exports = router
