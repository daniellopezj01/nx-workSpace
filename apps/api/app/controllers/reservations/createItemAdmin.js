const { matchedData } = require('express-validator')
const model = require('../../models/reservation')
const modelDeparture = require('../../models/departure')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const {
  emailReservation
} = require('../../middleware/emailer/emailReservation')

const createItemAdmin = async (req, res) => {
  try {
    const locale = req.getLocale()
    req = matchedData(req)
    const { idTour, idUser, idDeparture } = req
    await utils.isIDGood(idTour)
    await utils.isIDGood(idUser)
    await utils.isIDGood(idDeparture)
    const departure = await db.getItem(idDeparture, modelDeparture)
    req.amount = departure.normalPrice
    const reservation = await db.createItem(req, model)
    res.status(201).json(reservation)
    emailReservation(locale, reservation, 'create')
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { createItemAdmin }
