const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')
const {
  validateCreateItem,
  validateDeleteItem,
  validateUpdateItem,
  validateGetItem
} = require('../controllers/tours/validators')
const {
  createItem,
  deleteItem,
  updateItem,
  getItemAdmin,
  getForContinents,
  getContinents,
  getItemsAdmin,
  getItemsWithDepartures
} = require('../controllers/tours/index')

const { roleAuthorization } = require('../controllers/auth/index')

const mdCache = require('../middleware/cache')

const router = express.Router()

require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

router.get('/allContinents', trimRequest.all, mdCache.cache, getContinents)

router.get('/forContinents', mdCache.cache, trimRequest.all, getForContinents)

router.get(
  '/departures',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getItemsWithDepartures
)

router.get(
  '/:query',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetItem,
  getItemAdmin
)

router.get(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getItemsAdmin
)

/**
 * @swagger
 * /tours/{id}:
 *    patch:
 *      tags:
 *        - tours
 *      summary: "actualizar datos de tours por parametro id "
 *      description: "buscar tour por id y actualizar body"
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
 *          description: identificador del tour a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *        -  in: "body"
 *           name: "body"
 *           description: "parametros requeridos para actualizar tour"
 *           required: true
 *           schema:
 *                $ref: "#/definitions/tours"
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
 * /tours/{id}:
 *    delete:
 *      tags:
 *        - tours
 *      summary: "Eliminar tours por parametro id "
 *      description: "eliminar tour por el id"
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
 *          description: identificador del tour a eliminar
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
