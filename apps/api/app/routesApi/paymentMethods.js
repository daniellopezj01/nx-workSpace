const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')

const { roleAuthorization } = require('../controllers/auth/index')
const { getDefaultItem } = require('../controllers/paymentMethods')

const router = express.Router()
require('../../config/passport')

const requireAuth = passport.authenticate('jwt', {
  session: false
})

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
router.get(
  '/default',
  requireAuth,
  trimRequest.all,
  roleAuthorization(['admin', 'user']),
  getDefaultItem
)

module.exports = router
