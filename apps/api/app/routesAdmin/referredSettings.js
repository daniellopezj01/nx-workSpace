const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')

const router = express.Router()
require('../../config/passport')
const { roleAuthorization } = require('../controllers/auth/index')

const {
  validateCreateItem,
  validateGetItem,
  validateUpdateItem,
  validateDeleteItem
} = require('../controllers/referredSettings/validators')

const {
  createItem,
  getItemsAdmin,
  getItem,
  updateItem,
  deleteItem
} = require('../controllers/referredSettings/index')

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
router.get('/', requireAuth, trimRequest.all, getItemsAdmin)

router.get(
  '/:id',
  requireAuth,
  validateGetItem,
  getItem
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
  trimRequest.all,
  validateCreateItem,
  createItem
)

router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateUpdateItem,
  updateItem
)

router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateDeleteItem,
  deleteItem
)

module.exports = router
