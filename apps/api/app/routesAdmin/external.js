const express = require('express')
const trimRequest = require('trim-request')
const { addPicturesToTours } = require('../controllers/external')

const router = express.Router()
require('../../config/passport')

/**
 * @swagger
 * /api/1.0/external/blog:
 *    get:
 *      tags:
 *        - external
 *      summary: "acceder a todos los items"
 *      description: Listar todos los items.
 *      responses:
 *        '200':
 *          description: lista de items
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 */
router.get('/tourImages', trimRequest.all, addPicturesToTours)
// router.get('/blog', mdCache.cache, trimRequest.all, getItemsBlog)
// router.get('/blog', trimRequest.all, controller.getItemsBlog)

/**
 * @swagger
 * /api/1.0/external/instagram:
 *    get:
 *      tags:
 *        - external
 *      summary: "acceder a todos los items"
 *      description: Listar todos los items.
 *      responses:
 *        '200':
 *          description: lista de items
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 */
// router.get('/instagram', mdCache.cache, trimRequest.all, getItemsInstagram)

module.exports = router
