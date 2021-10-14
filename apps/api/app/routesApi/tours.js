const express = require('express')
const trimRequest = require('trim-request')
const {
  getItems,
  getItem,
  getForContinents,
  getToursAndPlaces,
  getTourWithDepartures,
  getTourForReservation,
  getToursFilterList
} = require('../controllers/tours/index')
const {
  validateGetItem,
  validateGetTourForReservation
} = require('../controllers/tours/validators')
const mdCache = require('../middleware/cache')
const elastic = require('../middleware/elastic')

const router = express.Router()
require('../../config/passport')

/**
 * @swagger
 * /api/1.0/tours/forContinents:
 *    get:
 *      tags:
 *        - tours
 *      summary: "buscar por continente"
 *      description: Busca los tours por continente
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
router.get('/forContinents', mdCache.cache, trimRequest.all, getForContinents)

/**
 * @swagger
 * /api/1.0/tours/search:
 *    get:
 *      tags:
 *        - tours
 *      summary: "ruta de acceso /tours/search?query=MedeLLIN"
 *      description: toma un punto de referencia y busca los tours que tengan actividades en un rango determinado.
 *      responses:
 *        '200':
 *          description: Retorna los objetos encontrados
 *        '404':
 *          description: params error
 *      parameters:
 *        - name: query
 *          in: query
 *          description: lugar por el cual se van a buscar tour
 *          schema:
 *            type: string
 *            format: string
 *    responses:
 *      '200':
 *        description: retorna el objeto encontrado por el id, si  no es encontrado retorna err
 */
router.get('/search', elastic.log, trimRequest.all, getToursAndPlaces)

router.get(
  '/getFilters',
  mdCache.cache,
  elastic.log,
  trimRequest.all,
  getToursFilterList
)
/**
 * @swagger
 * /api/1.0/tours:
 *    get:
 *      tags:
 *        - tours
 *      summary: "acceder a todos los tours"
 *      description: Listar todas las tours.
 *      responses:
 *        '200':
 *          description: lista de tours
 *    responses:
 *      '200':
 *        description: retorna todos los datos en la coleccion
 */
router.get('/', mdCache.cache, trimRequest.all, elastic.log, getItems)

/**
 * @swagger
 * /api/1.0/tours/{id}:
 *    get:
 *      tags:
 *        - tours
 *      summary: "buscar tours por parametro id"
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
router.get('/:query', trimRequest.all, validateGetItem, getItem)

/**
 * @swagger
 * /api/1.0/tours/departures/{id}:
 *    get:
 *      tags:
 *        - tours
 *      summary: "buscar tours por parametro id y sus salidas"
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
  '/departures/:query',
  trimRequest.all,
  validateGetItem,
  getTourWithDepartures
)

/**
 * @swagger
 * /api/1.0/tours/departures/{id}:
 *    get:
 *      tags:
 *        - tours
 *      summary: "buscar tours por parametro id y sus salidas"
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
  '/reservation/:query/:idIntention',
  trimRequest.all,
  validateGetTourForReservation,
  getTourForReservation
)

module.exports = router
