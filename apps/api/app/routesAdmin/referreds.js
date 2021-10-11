const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth/index')

const router = express.Router()
require('../../config/passport')

const {
  createItem,
  deleteItem,
  getItem,
  getItemsAdmin,
  updateItemAdmin
} = require('../controllers/referred/index')

const {
  validateCreateItem,
  validateDeleteItem,
  validateGetItem,
  validateUpdateItemAdmin
} = require('../controllers/referred/validators')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/**
 * @swagger
 * /payorders:
 *    get:
 *      tags:
 *        - payorders
 *      summary: "acceder a todos los ordenes"
 *      description: Listar todos las ordenes.
 *      responses:
 *        '200':
 *          description: lista de ordenes
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 */
router.get(
  '/',
  requireAuth,
  // roleAuthorization(['user', 'admin', 'host']),
  trimRequest.all,
  getItemsAdmin
)

/**
 * @swagger
 * /payorders:
 *    post:
 *      tags:
 *        - payorders
 *      summary: "agregar orden"
 *      description: crear nueva orden
 *      responses:
 *        '200':
 *          description: Retorna el objeto insertado en la coleccion.
 *        '422':
 *          description: Error de validacion.
 *      parameters:
 *        -  in: "body"
 *           name: "body"
 *           description: "parametros requeridos para insertar orden"
 *           required: true
 *           schema:
 *                $ref: "#/definitions/payOrders"
 *    responses:
 *      '201':
 *        description: retorna el objeto insertado en la coleccion con stado '201'
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateCreateItem,
  createItem
)

/**
 * @swagger
 * /payorders/{id}:
 *    get:
 *      tags:
 *        - payorders
 *      summary: "buscar orden por parametro id"
 *      description: "Buscar orden por el id"
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
 *          description: identificador de la orden a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *    responses:
 *      '200':
 *        description: retorna el objeto encontrado por el id, si  no es encontrado retorna err
 */
router.get(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetItem,
  getItem
)

/**
 * @swagger
 * /payorders/{id}:
 *    patch:
 *      tags:
 *        - payorders
 *      summary: "actualizar datos de orden por parametro id "
 *      description: "buscar orden por id y actualizar body"
 *      responses:
 *        '200':
 *          description: Datos actualizados, retorna el objeto actualizado
 *        '404':
 *          description: No se encuentra el objeto, mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *      parameters:
 *        - name: id
 *          in: query
 *          description: identificador de la orden a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *        -  in: "body"
 *           name: "body"
 *           description: "parametros requeridos para insertar orden"
 *           required: true
 *           schema:
 *                $ref: "#/definitions/payOrders"
 *    responses:
 *      '200':
 *        description: datos actualizados, retorna el objeto actualizado
 */
router.patch(
  '/:id',
  requireAuth,
  // roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateUpdateItemAdmin,
  updateItemAdmin
)

/**
 * @swagger
 * /payorders/{id}:
 *    delete:
 *      tags:
 *        - payorders
 *      summary: "Eliminar orden por parametro id "
 *      description: "eliminar orden por el id"
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
 *          description: identificador de la orden a eliminar
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
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateDeleteItem,
  deleteItem
)

module.exports = router
