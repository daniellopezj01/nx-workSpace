const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')

const {
  validateChangePass,
  validateUpdateItem,
  validateGetPublicProfile
} = require('../controllers/profile/validators')

const {
  getProfile,
  changePassword,
  getPublicProfile,
  getReferredById,
  updateItem
} = require('../controllers/profile/index')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

/*
 * Profile routes
 */

/**
 * @swagger
 * /api/1.0/profile:
 *    get:
 *      tags:
 *        - profile
 *      summary: "acceder a datos del usuario logueado"
 *      description: acceder a datos del usuario logueado.
 *      responses:
 *        '200':
 *          description: retorna objeto con datos del usuario
 *    responses:
 *      '200':
 *        description: retorna objeto con datos del usuario
 */
router.get(
  '/',
  requireAuth,
  // AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getProfile
)

/**
 * @swagger
 * /api/1.0/profile/public/{id}:
 *    get:
 *      tags:
 *        - profile
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
  '/public/:id',
  // requireAuth,
  // AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateGetPublicProfile,
  getPublicProfile
)

/**
 * @swagger
 * /api/1.0/profile/referred:
 *    get:
 *      tags:
 *        - profile
 *      summary: "acceder a datos de usuarios referidos"
 *      description: acceder a datos de usuarios referidos.
 *      responses:
 *        '200':
 *          description: lista de usuarios referidos
 *    responses:
 *      '200':
 *        description: retorna objeto con datos del usuario
 */
router.get(
  '/referred',
  requireAuth,
  // AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  // validate.getProfilePublic,
  getReferredById
)

/**
 * @swagger
 * /api/1.0/profile:
 *    patch:
 *      tags:
 *        - profile
 *      summary: "actualizar datos de usuario"
 *      description: actualizar usuario
 *      responses:
 *        '200':
 *          description: Retorna el objeto actualizado del usuario logueado.
 *        '422':
 *          description: Error de validacion.
 *      parameters:
 *        -  in: "body"
 *           name: "body"
 *           description: "parametros requeridos para actualizar perfil de usuario"
 *           required: true
 *           schema:
 *                $ref: "#/definitions/profile"
 *    responses:
 *      '201':
 *        description: retorna el objeto insertado en la coleccion con stado '201'
 */
router.patch(
  '/',
  requireAuth,
  // AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateUpdateItem,
  updateItem
)

/**
 * @swagger
 * /api/1.0/profile/changePassword:
 *    post:
 *      tags:
 *        - profile
 *      summary: "cambio de password"
 *      description: actualizar password de acceso al sistema
 *      responses:
 *        '200':
 *          description: Retorna mensaje de cambio de password.
 *        '422':
 *          description: Error de validacion.
 *      parameters:
 *        -  in: "body"
 *           name: "body"
 *           description: "parametros requeridos para actualizar password"
 *           required: true
 *           schema:
 *                type: object
 *                required:
 *                    - old
 *                    - newpass
 *                properties:
 *                      old:
 *                        type: string
 *                      newpass:
 *                        type: string
 *    responses:
 *      '201':
 *        description: actualizacion de password
 */
router.post(
  '/changePassword',
  requireAuth,
  // AuthController.roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateChangePass,
  changePassword
)

module.exports = router
