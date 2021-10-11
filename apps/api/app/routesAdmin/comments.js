const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

const {
  createItem,
  deleteItem,
  getItemAdmin,
  getItemsAdmin,
  updateItem
} = require('../controllers/comments')

const {
  validateCreateItem,
  validateDeleteItem,
  validateGetItem,
  validateUpdateItem
} = require('../controllers/comments/validators')

/**
 * @swagger
 * /api/1.0/comments/forUser/{idUser}:
 *    get:
 *      tags:
 *        - comments
 *      summary: "buscar comentarios por parametro idUser"
 *      description: "Buscar comentarios por el idUser"
 *      responses:
 *        '200':
 *          description: Retorna array de comentarios
 *        '422':
 *          description: Error de validacion o No se encuentra el objeto.
 *      parameters:
 *       - name: idUser
 *         in: path
 *         description: identificador del item a buscar
 *         required: true
 *         schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: retorna el array encontrado por el idUser, si  no es encontrado retorna err
 *      '401':
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get(
  '/',
  requireAuth,
  trimRequest.all,
  getItemsAdmin
)

/**
 * @swagger
 * /api/1.0/comments/{idTour}:
 *    post:
 *      tags:
 *          - comments
 *      summary: "agregar nuevo comentario"
 *      description: Create new comment
 *      consumes: "application/json"
 *      produces: "application/json"
 *      parameters:
 *      -  name: idTour
 *         in: path
 *         description: identificador del tour a insertar comentario
 *         required: true
 *         schema:
 *          type: string
 *          format: string
 *      -  name: body
 *         in: body
 *         description: "required params for insert to item"
 *         required: true
 *         schema:
 *            $ref: "#/definitions/commentary"
 *      responses:
 *        '200':
 *          description: Successfull Response
 *        '404':
 *          description: No se encuentra el objeto mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *      '401':
 *        description: 'You do not have necessary permissions for the resource'
 */
router.post(
  '/',
  requireAuth,
  // AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateCreateItem,
  createItem
)

/**
 * @swagger
 * /api/1.0/comments/{q}:
 *    get:
 *      tags:
 *        - comments
 *      summary: "buscar comentarios por parametro slug de un tour"
 *      description: "Buscar comentarios por el slug de un tour"
 *      responses:
 *        '200':
 *          description: Retorna el comentarios encontrado por el slug del tour
 *        '404':
 *          description: No se encuentra el objeto, mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *      parameters:
 *       - name: q
 *         in: path
 *         description: slug del tour
 *         required: true
 *         schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: Retorna el comentarios encontrado por el slug del tour
 */
router.get('/:id', trimRequest.all, requireAuth, validateGetItem, getItemAdmin)

router.patch(
  '/:id',
  requireAuth,
  trimRequest.all,
  validateUpdateItem,
  updateItem
)

/**
 * @swagger
 * /api/1.0/comments/{idTour}/{id}:
 *    delete:
 *      tags:
 *        - comments
 *      summary: "Eliminar comentario por tour y id del comentario"
 *      description: "Eliminar comentario por tour y id del comentario"
 *      responses:
 *        '200':
 *          description: Objeto del tour
 *        '404':
 *          description: No se encuentra el objeto mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *      '401':
 *        description: 'You do not have necessary permissions for the resource'
 *      parameters:
 *       - name: id
 *         in: path
 *         description: identificador del comentario a eliminar
 *         required: true
 *         schema:
 *          type: string
 *          format: string
 *       - name: idTour
 *         in: path
 *         description: identificador del tour a buscar
 *         required: true
 *         schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: retorna el objeto encontrado por el idUser, si  no es encontrado retorna err
 *      '401':
 *        description: 'You do not have necessary permissions for the resource'
 */
router.delete(
  '/:id',
  requireAuth,
  // AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateDeleteItem,
  deleteItem
)

module.exports = router
