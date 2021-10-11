const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')

const { roleAuthorization } = require('../controllers/auth/index')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

const {
  createItem
} = require('../controllers/messages/index')

const {
  validateCreateItem
} = require('../controllers/messages/validators')

/**
 * @swagger
 * /tickets/{id}:
 *    delete:
 *      tags:
 *        - tickets
 *      summary: "Eliminar tickets por parametro id "
 *      description: "Eliminar tickets por el id"
 *      responses:
 *        '200':
 *          description: Retorna mensaje DELETED
 *        '404':
 *          description: Objeto no encontrado
 *        '422':
 *          description: Error de validacion
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Identificador del ticket a eliminar
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '200':
 *        description: Retorna mensaje DELETED
 */
router.post(
  '/:hash',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateCreateItem,
  createItem
)

router.post(
  '/',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateCreateItem,
  createItem
)

module.exports = router
