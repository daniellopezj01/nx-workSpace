const { matchedData } = require('express-validator')
const model = require('../../models/reservation')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { hookChangeStatusReservation } = require('../hooks/services')
const {
  emailReservation
} = require('../../middleware/emailer/emailReservation')

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (req, res) => {
  try {
    const { user } = req
    const locale = req.getLocale()
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    let reservation = await db.getItem(id, model)
    if (`${reservation.idUser}` === `${user._id}`) {
      reservation = await db.updateItem(id, model, req)
      // eslint-disable-next-line no-unused-expressions
      const { status } = reservation
      res.status(200).json(reservation)
      hookChangeStatusReservation(req, reservation)
      emailReservation(
        locale,
        reservation,
        status !== 'cancelled' ? 'update' : 'cancel'
      )
    } else {
      utils.handleError(res, { code: 422, message: 'USER_NOT_AUTHORIZE' })
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { updateItem }
