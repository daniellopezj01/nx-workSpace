const express = require('express')
const trimRequest = require('trim-request')
const passport = require('passport')

const { roleAuthorization } = require('../controllers/auth/index')
const { createItem, getItems } = require('../controllers/paymentMethods')
const {
  validateCreateItem
} = require('../controllers/paymentMethods/validators')

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
router.post(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateCreateItem,
  createItem
)

router.get(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getItems
)

module.exports = router
