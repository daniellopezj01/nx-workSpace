const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')
const mdCache = require('../middleware/cache')
const { roleAuthorization } = require('../controllers/auth/index')
const {
  createItem,
  getItem,
  getItems,
  updateItem,
  deleteItem
} = require('../controllers/categories/index')
const {
  validateCreateItem,
  validateGetItem,
  validateUpdateItem,
  validateDeleteItem
} = require('../controllers/categories/validators')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/*
 * Get items route
 */

/**
 * @swagger
 * /categories:
 *    get:
 *      tags:
 *        - categories
 *      summary: "acceder a todos las categories"
 *      description: Listar todos las categorias.
 *      responses:
 *        '200':
 *          description: lista de categorias
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 *      '403':
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get(
  '/',
  requireAuth,
  mdCache.cache,
  roleAuthorization(['admin']),
  trimRequest.all,
  getItems
)

/**
 * @swagger
 * /categories:
 *    post:
 *      tags:
 *          - categories
 *      summary: "agregar nueva categoria"
 *      description: Create new category
 *      consumes: "application/json"
 *      produces: "application/json"
 *      parameters:
 *      -  in: body
 *         name: body
 *         description: "required params for insert to categories"
 *         required: true
 *         schema:
 *            $ref: "#/definitions/categories"
 *      responses:
 *        '200':
 *          description: Successfull Response
 *    responses:
 *      '200':
 *        description: Successfully inserted a category
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
 * /categories/{id}:
 *    get:
 *      tags:
 *        - categories
 *      summary: "buscar categoria por parametro id"
 *      description: "Buscar categoria por el id"
 *      responses:
 *        '200':
 *          description: Retorna el objeto encontrado por el id
 *        '404':
 *          description: No se encuentra el objeto, mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *      parameters:
 *       - name: id
 *         in: path
 *         description: identificador de la categoria a buscar
 *         required: true
 *         schema:
 *          type: string
 *          format: string
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
 * /categories/{id}:
 *    patch:
 *      tags:
 *        - categories
 *      summary: "actualizar datos de categoria por parametro id "
 *      description: "buscar categoria por id y actualizar body"
 *      responses:
 *        '200':
 *          description: Datos actualizados, retorna el objeto actualizado
 *        '404':
 *          description: No se encuentra el objeto, mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *      parameters:
 *      - name: id
 *        in: path
 *        description: identificador de la categoria a buscar
 *        required: true
 *        schema:
 *           type: string
 *           format: string
 *      - in: "body"
 *        name: "body"
 *        description: "parametros requeridos para actualizar categoria"
 *        required: true
 *        schema:
 *            $ref: "#/definitions/categories"
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
 * /categories/{id}:
 *    delete:
 *      tags:
 *        - categories
 *      summary: "Eliminar categoria por parametro id "
 *      description: "eliminar categoria por el id"
 *      responses:
 *        '200':
 *          description: Mensaje DELETED
 *        '404':
 *          description: No se encuentra el objeto mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: identificador de la categoria a eliminar
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: mensaje DELETED
 */
router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['host', 'admin']),
  trimRequest.all,
  validateDeleteItem,
  deleteItem
)

module.exports = router
