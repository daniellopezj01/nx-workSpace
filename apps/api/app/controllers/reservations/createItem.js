const { matchedData } = require('express-validator')
const model = require('../../models/reservation')
const modelDeparture = require('../../models/departure')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const {
  emailReservation
} = require('../../middleware/emailer/emailReservation')
const { webHooks } = require('../../services/hookService')
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, res) => {
  try {
    const { user } = req
    const locale = req.getLocale()
    req = matchedData(req)
    const { idIntention } = req
    const { url, header } = await utils.structureRequest()
    utils
      .httpRequest$(
        `${url}/payIntention/getItem/${idIntention}`,
        'post',
        header
      )
      .subscribe(
        async (response) => {
          const {
            idOperation,
            total,
            accessToken,
            percentage
          } = response
          if (accessToken === user.accessToken) {
            const departure = await db.getItem(idOperation, modelDeparture)
            const { idTour } = departure
            req = {
              ...req,
              amount: total,
              idTour,
              idDeparture: idOperation,
              idUser: user._id,
              percentage
            }
            const reservation = await db.createItem(req, model)
            webHooks.trigger('reservation.created', reservation)
            console.log('hook: reservation.created')
            res.status(201).json(reservation)
            emailReservation(locale, reservation, 'create')
          } else {
            utils.handleError(res, { code: 422, message: 'NOT_MATCH_USER' })
          }
        },
        (err) => {
          console.log('respondio error', err.message)
          utils.handleErrorHooks(res, err)
        }
      )
  } catch (error) {
    console.log(error.message)
    utils.handleError(res, error)
  }
}

module.exports = { createItem }
