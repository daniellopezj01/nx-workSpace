const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')
const { validateGetItem } = require('../controllers/storage/validators')
const { createItem, getItem } = require('../controllers/storage/index')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/**
 * @swagger
 * /api/1.0/storage:
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
 *         name: file[]
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
  trimRequest.all,
  createItem
)

/**
 * @swagger
 * /api/1.0/storage/{id}:
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
  trimRequest.all,
  validateGetItem,
  getItem
)

module.exports = router
