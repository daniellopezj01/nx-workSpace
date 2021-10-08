const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperCheckKey } = require('./helpers/index')
const { serviceTourForReservation } = require('./services')
const modelDeparture = require('../../models/departure')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getTourForReservation = async (req, res) => {
  try {
    req = matchedData(req)
    const { idIntention } = req
    const query = await helperCheckKey(req.query)
    const data = {}
    data.tour = await serviceTourForReservation(query)
    const { url, header } = await utils.structureRequest()
    utils
      .httpRequest$(
        `${url}/payIntention/getItem/${idIntention}`,
        'post',
        header
      )
      .subscribe(
        async (response) => {
          delete response.accessToken
          data.intention = response
          const { idOperation } = response
          data.departure = await db.getItem(idOperation, modelDeparture)
          res.status(200).json(data)
        },
        (err) => {
          utils.handleErrorHooks(res, err)
        }
      )
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getTourForReservation }
