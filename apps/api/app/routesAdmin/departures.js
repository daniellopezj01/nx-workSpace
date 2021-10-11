const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')

const { roleAuthorization } = require('../controllers/auth/index')

const router = express.Router()
require('../../config/passport')

const {
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/departures/index')
const {
  validateCreateItem,
  validateUpdateItem,
  validateDeleteItem
} = require('../controllers/departures/validators')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/**
 * @swagger
 * /departures:
 *    get:
 *      tags:
 *        - departures
 *      summary: "acceder a todas las salidas"
 *      description: Listar todas las salidas.
 *      responses:
 *        '200':
 *          description: lista de salidas
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 */
// router.get('/',
//   requireAuth,
//   roleAuthorization(['admin']),
//   trimRequest.all,
//   controller.getItems)

/**
 * @swagger
 * /departures:
 *    post:
 *      tags:
 *        - departures
 *      summary: "agregar salida"
 *      description: crear nueva salida
 *      responses:
 *        '200':
 *          description: Retorna el objeto insertado en la coleccion.
 *        '422':
 *          description: Error de validacion en alguno de los campos ingresados.
 *      parameters:
 *        -  in: "body"
 *           name: "body"
 *           description: "parametros requeridos para insertar salida"
 *           required: true
 *           schema:
 *                 $ref: "#/definitions/departures"
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
 * /departures/{id}:
 *    get:
 *      tags:
 *        - departures
 *      summary: "buscar salida por parametro id"
 *      description: "Buscar salida por el id"
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
 *          description: identificador del salida a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *    responses:
 *      '200':
 *        description: retorna el objeto encontrado por el id, si  no es encontrado retorna err
 */
// router.get(
//   '/:id',
//   requireAuth,
//   roleAuthorization(['admin']),
//   trimRequest.all,
//   validate.getItem,
//   controller.getItem
// )

/**
 * @swagger
 * /departures/{id}:
 *    patch:
 *      tags:
 *        - departures
 *      summary: "actualizar datos de salida por parametro id "
 *      description: "buscar salida por id y actualizar body"
 *      responses:
 *        '200':
 *          description: Datos actualizados, retorna el objeto actualizado
 *        '404':
 *          description: No se encuentra el objeto, mensaje 'error'
 *        '422':
 *          description: Error de validacion en alguno de los campos digitados.
 *      parameters:
 *       - name: id
 *         in: query
 *         description: identificador del salida a buscar
 *         required: true
 *         schema:
 *           type: string
 *           format: string
 *       -  in: "body"
 *          name: "body"
 *          description: "parametros requeridos para actualizar salida"
 *          required: true
 *          schema:
 *                $ref: "#/definitions/departures"
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
 * /departures/{id}:
 *    delete:
 *      tags:
 *        - departures
 *      summary: "Eliminar salida por parametro id "
 *      description: "eliminar salida por el id"
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
 *          description: identificador del salida a eliminar
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
