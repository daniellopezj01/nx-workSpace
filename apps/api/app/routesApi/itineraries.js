const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')

const router = express.Router()
require('../../config/passport')

const { getItem, getItems } = require('../controllers/itineraries')
const { validateGetItem } = require('../controllers/itineraries/validators')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/**
 * @swagger
 * /api/1.0/itineraries:
 *    get:
 *      tags:
 *        - itineraries
 *      summary: "acceder a todos los itinerarios"
 *      description: Listar todos las itinerarios.
 *      responses:
 *        '200':
 *          description: lista de itinerarios
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 */
router.get(
  '/',
  // requireAuth,
  // AuthController.roleAuthorization(['user', 'host','admin']),
  trimRequest.all,
  getItems
)

/**
 * @swagger
 * /api/1.0/itineraries/{id}:
 *    get:
 *      tags:
 *        - itineraries
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
router.get('/:id', requireAuth, trimRequest.all, validateGetItem, getItem)

module.exports = router
