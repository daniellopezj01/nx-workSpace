const express = require('express')
const passport = require('passport')
const trimRequest = require('trim-request')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

const {
  validateForgotPassword,
  validateLogin,
  validateResetPassword,
  validateExchange,
  validateRegisterAdmin
} = require('../controllers/auth/validators')

const {
  getRefreshToken,
  roleAuthorization,
  login,
  forgotPassword,
  exchangeToken,
  register,
  resetPassword,
  resetPasswordFromPanel
} = require('../controllers/auth/index')

/*
 * Forgot password route
 */
router.post(
  '/forgot',
  trimRequest.all,
  validateForgotPassword,
  forgotPassword
)

/*
 * Reset password route
 */
router.post(
  '/resetPasswordFromAdmin',
  trimRequest.all,
  validateResetPassword,
  resetPasswordFromPanel
)
/*
 * Reset password route
 */
router.post(
  '/resetAdmin',
  trimRequest.all,
  validateResetPassword,
  resetPassword
)
/*
 * Get new refresh token
 */
router.get(
  '/token',
  requireAuth,
  roleAuthorization(['admin']),
  // trimRequest.all,
  getRefreshToken
)

/*
 * Login route
 */
router.post('/login', trimRequest.all, validateLogin, login)

/**
 * @swagger
 * /api/1.0/token:
 *    get:
 *      tags:
 *        - auth
 *      summary: "asigna un nuevo token "
 *      description: asigna un nuevo token al usuario logeado
 *      responses:
 *        '200':
 *          description: retorna nuevo token
 *        '401':
 *          description:  desautorizado
 *    responses:
 *      '200':
 *        description: retorna el token del usuario logeado
 */

router.get('/token', requireAuth, trimRequest.all, getRefreshToken)
/**
 * @swagger
 * /api/1.0/register:
 *    post:
 *      tags:
 *        - auth
 *      summary: "registro de usuario"
 *      description: registrar usuario en la aplicacion
 *      responses:
 *        '200':
 *          description: Retorna el objeto insertado en la coleccion.
 *        '422':
 *          description: Email ya esta registrado o campos no cumplen validacion.
 *    parameters:
 *      -  in: "body"
 *         name: "body"
 *         description: "parametros requeridos para insertar usuario"
 *         required: true
 *         schema:
 *            $ref: "#/definitions/authRegister"
 *    responses:
 *      '201':
 *        description: retorna el objeto insertado en la coleccion
 */
router.post(
  '/register',
  trimRequest.all,
  validateRegisterAdmin,
  register
)

/**
* Exchange TOKEN
*/

router.post(
  '/exchange',
  trimRequest.all,
  validateExchange,
  exchangeToken
)

module.exports = router
