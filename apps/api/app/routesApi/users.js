const express = require('express')
// const passport = require('passport')
const trimRequest = require('trim-request')

const router = express.Router()
require('../../config/passport')

const {
  getItemPublic,
  getAllAgents

} = require('../controllers/users')

const {

  validateGetItem
} = require('../controllers/users/validators')

/**
 * @swagger
 * /api/1.0/users/public/{id}:
 *    get:
 *      tags:
 *        - users
 *      summary: "buscar usuario por parametro id"
 *      description: "Buscar tour por el id"
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
 *          description: identificador del tour a buscar
 *          required: true
 *          schema:
 *            type: string
 *            format: string
 *    responses:
 *      '200':
 *        description: retorna el objeto encontrado por el id, si  no es encontrado retorna err
 */
router.get(
  '/public/:id',
  trimRequest.all,
  validateGetItem,
  getItemPublic
)

router.get(
  '/agents',
  trimRequest.all,
  getAllAgents
)

module.exports = router
