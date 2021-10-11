const express = require('express')
const trimRequest = require('trim-request')
const mdCache = require('../middleware/cache')
const { checkSingle } = require('../controllers/settings')

const router = express.Router()
require('../../config/passport')
/*
 * Get items route
 */

/**
 * @swagger
 * /api/1.0/settings/check:
 *    get:
 *      tags:
 *        - settings
 *      summary: "settings de la app"
 *      description: retorna los settings basicos de la app
 *      responses:
 *        '200':
 *          description: Retorna los objetos encontrados
 *        '404':
 *          description: No se encuentra ningun objeto, mensaje 'error'
 *        '422':
 *          description: Error de validacion.
 *    responses:
 *      '200':
 *        description: retorna objeto, si  no es encontrado retorna err
 */
router.get('/check', mdCache.cache, trimRequest.all, checkSingle)

module.exports = router
