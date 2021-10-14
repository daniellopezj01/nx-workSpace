const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')

const {
  updateItem,
  createPaymentWithWallet
} = require('../controllers/payOrders/index')
const {
  validateUpdateItem,
  validatePaymentWallet
} = require('../controllers/payOrders/validators')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

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
  validatePaymentWallet,
  createPaymentWithWallet
)

/**
 * @swagger
 * /api/1.0/payorders/{id}:
 *    patch:
 *      tags:
 *        - payOrder
 *      summary: "actualizar datos de payorder por parametro id de operacion "
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
 *          description: identificador id de operacion
 *          required: true
 *        -  in: "body"
 *           name: "body"
 *           description: "Data de respuesta de plataforma de pago"
 *           required: false
 *           schema:
 *                type: object
 *                properties:
 *                      customData:
 *                        type: object
 *                        description: Objeto devuelto por la plataforma de pago
 *    responses:
 *      '200':
 *        description: datos actualizados, retorna el objeto actualizado
 */
router.patch(
  '/:id',
  requireAuth,
  trimRequest.all,
  validateUpdateItem,
  updateItem
)

module.exports = router
