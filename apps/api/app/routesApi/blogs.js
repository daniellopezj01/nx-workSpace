const express = require('express')
const trimRequest = require('trim-request')

const router = express.Router()
require('../../config/passport')

const { validateGetItem } = require('../controllers/blogs/validators')
const { getItems, getItemSlug } = require('../controllers/blogs')

/*
 * Users routes
 */

/**
 * @swagger
 * /api/1.0/blogs:
 *    get:
 *      tags:
 *        - blogs
 *      summary: "acceder a todos los items"
 *      description: Listar todos los items.
 *      responses:
 *        '200':
 *          description: lista de items
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 *      '403':
 *        description: 'You do not have necessary permissions for the resource'
 */
router.get('/', trimRequest.all, getItems)

/**
 * @swagger
 * /api/1.0/blogs/{id}:
 *    get:
 *      tags:
 *        - blogs
 *      summary: "buscar item por parametro id"
 *      description: "Buscar item por el id"
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
 *         description: identificador del item a buscar
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
  // requireAuth,
  // AuthController.roleAuthorization(['admin', 'user']),
  trimRequest.all,
  validateGetItem,
  getItemSlug
)

module.exports = router
