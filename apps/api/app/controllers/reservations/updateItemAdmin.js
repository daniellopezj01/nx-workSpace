const { matchedData } = require('express-validator')
const model = require('../../models/reservation')
const modelDeparture = require('../../models/departure')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { emailChangeToursInReservation, emailCancelReservation } = require('../../middleware/emailer/index')
const { webHooks } = require('../../services/hookService')
/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItemAdmin = async (req, res) => {
  try {
    const locale = req.getLocale()
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    let reservation = await db.getItem(id, model)
    const newDeparture = req?.idDeparture?.toString()
    const aldDeparture = reservation?.idDeparture?.toString()
    if (newDeparture && newDeparture !== aldDeparture) {
      const departure = await db.getItem(req.idDeparture, modelDeparture)
      req.amount = departure.normalPrice
    }
    reservation = await db.updateItem(id, model, req)
    res.status(200).json(reservation)
    webHooks.trigger('admin.reservation.changed', reservation)
    if (newDeparture && newDeparture !== aldDeparture) {
      emailChangeToursInReservation(locale, reservation)
    }
    if (req.status === 'cancelled') {
      emailCancelReservation(locale, reservation)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { updateItemAdmin }
