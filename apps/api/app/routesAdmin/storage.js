const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')
// const = require('../controllers/auth')
const { roleAuthorization } = require('../controllers/auth/index')
const {
  validateDeleteItem,
  validateGetItem
} = require('../controllers/storage/validators')
const {
  createItem,
  getItems,
  deleteItem,
  getItem,
  newSize
} = require('../controllers/storage/index')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/**
 * @swagger
 * /storage:
 *    get:
 *      tags:
 *        - storage
 *      summary: "Acceder a todos los archivos multimedia"
 *      description: Acceder a todos los archivos multimedia
 *      responses:
 *        '200':
 *          description: Lista de archivos multimedia
 *    responses:
 *      '200':
 *        description: Lista de archivos multimedia
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['user', 'host', 'admin']),
  trimRequest.all,
  getItems
)

/**
 * @swagger
 * /storage:
 *    post:
 *      tags:
 *          - storage
 *      summary: "Agregar un nuevo archivo multimedia"
 *      description: Agregar un nuevo archivo multimedia
 *      consumes:
 *        - multipart/form-data
 *      produces: "application/json"
 *      parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: archivo a almacenar, tener en cuenta que debe ser un formato multimedia
 *      responses:
 *        '200':
 *          description: Retorna el objeto creado en al colección
 *        '422':
 *          description: Error de validación
 *
 *    responses:
 *      '209':
 *        description: Retorna el objeto creado
 *      '422':
 *        description: Error de validación
 *
 *
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['host', 'admin']),
  trimRequest.all,
  createItem
)

router.get(
  '/newSize',
  requireAuth,
  roleAuthorization(['host', 'admin']),
  trimRequest.all,
  newSize
)
/**
 * @swagger
 * /storage/{id}:
 *    get:
 *      tags:
 *        - storage
 *      summary: "Buscar archivo por parametro id de la colección"
 *      description: "Buscar archivo multimedia por el id"
 *      responses:
 *        '200':
 *          description: Retorna el objeto encontrado por el id
 *        '404':
 *          description: No se encuentra el objeto por el id
 *        '422':
 *          description: Error de validación
 *
 *      parameters:
 *       - name: id
 *         in: path
 *         description: Identificador del archivo multimedia en la colección
 *         required: true
 *         schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: Retorna el objeto por el id
 *      '404':
 *        description: No se encuentra el objeto por el id
 *      '422':
 *        description: Error de validación
 */
router.get(
  '/:id',
  requireAuth,
  roleAuthorization(['user', 'host', 'admin']),
  trimRequest.all,
  validateGetItem,
  getItem
)

/**
 * @swagger
 * /storage/{id}:
 *    delete:
 *      tags:
 *        - storage
 *      summary: "Eliminar el archivo multimedia"
 *      description: "Eliminar el archivo multimedia por el id"
 *      responses:
 *        '200':
 *          description: Mensaje DELETED
 *        '404':
 *          description: No se encuentra el objeto
 *        '422':
 *          description: Error de validación
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Identificador del archivo a eliminar
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: Archivo eliminado satisfactoriamente
 */
router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['user', 'host', 'admin']),
  trimRequest.all,
  validateDeleteItem,
  deleteItem
)

module.exports = router
