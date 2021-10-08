const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')
const { roleAuthorization } = require('../controllers/auth/index')

const router = express.Router()
require('../../config/passport')
const {
  createItem,
  getItem,
  getItems,
  updateItem,
  deleteItem
} = require('../controllers/itineraries/index')
const {
  validateCreateItem,
  validateGetItem,
  validateUpdateItem,
  validateDeleteItem
} = require('../controllers/itineraries/validators')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/**
 * @swagger
 * /itineraries:
 *    get:
 *      tags:
 *        - itineraries
 *      summary: "acceder a todos los itinerarios"
 *      description: Listar todos las itinerarios.
 *      responses:
 *        '200':
 *          description: lista de itinerarios
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 */
router.get(
  '/',
  // requireAuth,
  // roleAuthorization(['user', 'host','admin']),
  trimRequest.all,
  getItems
)

/**
 * @swagger
 * /itineraries:
 *    post:
 *      tags:
 *        - itineraries
 *      summary: "agregar itinerario"
 *      description: crear nueva itinerario
 *      responses:
 *        '200':
 *          description: Retorna el objeto insertado en la coleccion.
 *        '422':
 *          description: Error de validacion en alguno de los campos ingresados.
 *      parameters:
 *        -  in: "body"
 *           name: "body"
 *           description: "parametros requeridos para insertar itinerario"
 *           required: true
 *           schema:
 *                $ref: "#/definitions/itineraries"
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
 * /itineraries/{id}:
 *    get:
 *      tags:
 *        - itineraries
 *      summary: "buscar itinerario por parametro id"
 *      description: "Buscar itinerario por el id"
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
 *          description: identificador del itinerario a buscar
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
 * /itineraries/{id}:
 *    patch:
 *      tags:
 *        - itineraries
 *      summary: "actualizar datos de itinerario por parametro id "
 *      description: "buscar itinerario por id y actualizar body"
 *      responses:
 *        '200':
 *          description: Datos actualizados, retorna el objeto actualizado
 *        '404':
 *          description: No se encuentra el objeto, mensaje 'error'
 *        '422':
 *          description: Error de validacion en alguno de los campos digitados.
 *      parameters:
 *        - name: id
 *          in: query
 *          description: identificador del itinerario a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *        -  in: "body"
 *           name: "body"
 *           description: "parametros requeridos para insertar itinerario"
 *           required: true
 *           schema:
 *                $ref: "#/definitions/itineraries"
 *    responses:
 *      '200':
 *        description: datos actualizados, retorna el objeto actualizado
 */
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateUpdateItem,
  updateItem
)

/**
 * @swagger
 * /itineraries/{id}:
 *    delete:
 *      tags:
 *        - itineraries
 *      summary: "Eliminar itinerario por parametro id "
 *      description: "eliminar itinerario por el id"
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
 *          description: identificador del itinerario a eliminar
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
