const express = require('express')
const trimRequest = require('trim-request')
const { getItems } = require('../controllers/questions')

const router = express.Router()
require('../../config/passport')

/**
 * @swagger
 * /api/1.0/categories:
 *    get:
 *      tags:
 *        - categories
 *      summary: "acceder a todos los items"
 *      description: Listar todos los items.
 *      responses:
 *        '200':
 *          description: lista de items
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 */
router.get('/', trimRequest.all, getItems)

module.exports = router
