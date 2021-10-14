const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')
const { roleAuthorization } = require('../controllers/auth/index')

require('../../config/passport')

const router = express.Router()
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const {
  validateCreateItem,
  validateGetItem,
  validateUpdateItem
} = require('../controllers/reservations/validators')
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  getPayments
} = require('../controllers/reservations/index')

/**
 * @swagger
 * /api/1.0/reservations:
 *    get:
 *      tags:
 *        - reservations
 *      summary: "ruta de acceso /reservations"
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
router.get('/login', (req, res) => {
  res.status(200).json({
    title: 'Express Login'
  })
})

/**
 * @swagger
 * /api/1.0/reservations:
 *    post:
 *      tags:
 *        - reservations
 *      summary: "agregar reservacion"
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
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateCreateItem,
  createItem
)

/**
 * @swagger
 * /api/1.0/reservations/{id}:
 *    get:
 *      tags:
 *        - reservations
 *      summary: "buscar itinerario por parametro id"
 *      description: "Buscar reservacion por el id"
 *      responses:
 *        '200':
 *          description: Retorna el objeto encontrado por el id
 *        '404':
 *          description: No se encuentra el objeto, mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *      parameters:
 *        - name: id
 *          in: path
 *          description: identificador del reservacion a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *    responses:
 *      '200':
 *        description: retorna el objeto encontrado por el id, si  no es encontrado retorna err
 */
router.get(
  '/:q',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateGetItem,
  getItem
)

/**
 * @swagger
 * /api/1.0/reservations/payment/{id}:
 *    get:
 *      tags:
 *        - reservations
 *      summary: "buscar itinerario por parametro id o code"
 *      description: "Buscar reservacion por el id o code"
 *      responses:
 *        '200':
 *          description: Retorna el objeto encontrado por el id o code
 *        '404':
 *          description: No se encuentra el objeto, mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *      parameters:
 *        - name: id
 *          in: path
 *          description: identificador del reservacion a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *    responses:
 *      '200':
 *        description: retorna el objeto encontrado por el id o code, si  no es encontrado retorna err
 */
router.get(
  '/payment/:q',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  validateGetItem,
  getPayments
)

/**
 * @swagger
 * /api/1.0/reservations/{id}:
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
 *          in: path
 *          description: identificador del reservacion a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *        -  name: "body"
 *           in: "body"
 *           description: "parametros requeridos para actualizar reservacion"
 *           required: true
 *           schema:
 *                $ref: "#/definitions/reservationsUpdate"
 *    responses:
 *      '200':
 *        description: datos actualizados, retorna el objeto actualizado
 */
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateUpdateItem,
  updateItem
)

module.exports = router
