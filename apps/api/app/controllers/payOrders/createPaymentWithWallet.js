/* eslint-disable consistent-return */
/* eslint-disable max-statements */
const { matchedData } = require('express-validator')
const model = require('../../models/payOrder')
const modelTour = require('../../models/tour')
const modelReservation = require('../../models/reservation')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperCheckKey } = require('../wallet/helpers')
const { serviceGetTotal } = require('../wallet/services')
const { emailPayments } = require('../../middleware/emailer/index')
const { helperCreatePdf } = require('./helpers')

const createObject = (user, amount, reservation, addToReservation) =>
  new Promise(async (resolve) => {
    const tour = await db.getItem(reservation?.idTour, modelTour)
    if (addToReservation) {
      resolve({
        idOperation: 'payment with wallet',
        amount,
        currency: process.env.TYPE_CURRENCY,
        idUser: user._id,
        idReservation: reservation._id,
        status: 'succeeded',
        description: `(${reservation.code})  ${tour.title}`
      })
    } else {
      resolve({
        idOperation: 'payment with wallet',
        amount: amount * -1,
        currency: process.env.TYPE_CURRENCY,
        idUser: user._id,
        idReservation: null,
        status: 'succeeded',
        description: `remove from wallet to reservation (${reservation.code}) ${tour.title}`
      })
    }
  })
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createPaymentWithWallet = async (req, res) => {
  try {
    const locale = req.getLocale()
    const { user } = req
    const data = matchedData(req)
    const updateReservation = {}
    const { idReservation } = data
    const { amount } = data
    if (idReservation) {
      const reservation = await db.getItem(idReservation, modelReservation)
      const totalMoneyWallet = await serviceGetTotal({
        idUser: user._id,
        idReservation: null
      })
      const wallet = Number(Math.trunc(totalMoneyWallet.total * 100) / 100, 2)
      if (amount <= wallet) {
        const removeFromWallet = await createObject(
          user,
          amount,
          reservation,
          false
        )
        const addMoneyToReservation = await createObject(
          user,
          amount,
          reservation,
          true
        )
        const payOrderWallet = await db.createItem(removeFromWallet, model)
        let payOrderReservation = await db.createItem(
          addMoneyToReservation,
          model
        )
        await helperCreatePdf(payOrderWallet)
        payOrderReservation = await helperCreatePdf(payOrderReservation)
        const query = await helperCheckKey(idReservation)
        const totalMoneyReservation = await serviceGetTotal(query)
        updateReservation.status =
          parseFloat(reservation.amount) >= totalMoneyReservation.total
            ? 'progress'
            : 'completed'
        await db.updateItem(idReservation, modelReservation, updateReservation)
        emailPayments(locale, payOrderReservation, reservation.status, user)
        res.status(201).json(payOrderReservation)
      } else {
        return utils.handleError(res, {
          code: 422,
          message: 'Amount Error'
        })
      }
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { createPaymentWithWallet }
