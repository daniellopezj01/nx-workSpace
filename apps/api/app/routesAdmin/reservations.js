const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')

const { roleAuthorization } = require('../controllers/auth/index')

const router = express.Router()
require('../../config/passport')
const {
  validateGetItem,
  validateUpdateItem,
  validateCreateItemAdmin,
  validateDeleteItem
} = require('../controllers/reservations/validators')
const {
  getItemAdmin,
  getItemsAdmin,
  createItemAdmin,
  deleteItem,
  updateItemAdmin
} = require('../controllers/reservations')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/**
 * @swagger
 * /reservations/forUser:
 *    get:
 *      tags:
 *        - reservations
 *      summary: "ruta de acceso /reservations/forUser"
 *      description: toma el token de la peticion y retorna los tours reservados por el usuario
 *      responses:
 *        '200':
 *          description: Retorna los objetos encontrados
 *        '404':
 *          description: No se encuentra ningun objeto, mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *    responses:
 *      '200':
 *        description: retorna el objeto encontrado por el id, si  no es encontrado retorna err
 */
router.get(
  '/all',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getItemsAdmin
)

/**
 * @swagger
 * /reservations:
 *    post:
 *      tags:
 *        - reservations
 *      summary: "agregar itinerario"
 *      description: crear nueva reservacion
 *      responses:
 *        '200':
 *          description: Retorna el objeto insertado en la coleccion.
 *        '422':
 *          description: Error de validacion en alguno de los campos ingresados.
 *      parameters:
 *        -  in: "body"
 *           name: "body"
 *           description: "parametros requeridos para insertar reservacion"
 *           required: true
 *           schema:
 *                $ref: "#/definitions/reservations"
 *    responses:
 *      '201':
 *        description: retorna el objeto insertado en la coleccion
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateCreateItemAdmin,
  createItemAdmin
)

router.get(
  '/getDetails/:q',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetItem,
  getItemAdmin
)

/**
 * @swagger
 * /reservations/{id}:
 *    patch:
 *      tags:
 *        - reservations
 *      summary: "actualizar datos de itinerario por parametro id "
 *      description: "buscar reservacion por id y actualizar body"
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
 *          description: identificador del reservacion a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *        -  in: "body"
 *           name: "body"
 *           description: "parametros requeridos para actualizar reservacion"
 *           required: true
 *           schema:
 *                $ref: "#/definitions/reservations"
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
  updateItemAdmin
)

/**
 * @swagger
 * /reservations/{id}:
 *    delete:
 *      tags:
 *        - reservations
 *      summary: "Eliminar itinerario por parametro id "
 *      description: "eliminar reservacion por el id"
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
 *          description: identificador del reservacion a eliminar
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
