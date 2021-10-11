const { check } = require('express-validator')
const mongoose = require('mongoose')
const { validateResult } = require('../../../middleware/utils')

/**
 * Validates create new item request
 */
const validatePayIntent = [
  check('accessToken')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('intent')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isIn(['buyTour', 'buyProduct', 'insertWallet'])
    .withMessage('USER_NOT_IN_KNOWN_ROLE')
    .custom((value, { req }) => {
      /**
       * Validate if insert amount in wallet
       */
      if (value === 'insertWallet') {
        const { amount } = req.body
        if (!amount || amount < 1) {
          throw new Error('(amount) AMOUNT_INVALID_ZERO')
        }
      }

      /**
       * Validate if intent buy a tour
       */

      if (['buyTour'].includes(value)) {
        const { id } = req.body
        if (!id) {
          throw new Error('ID_TOUR_DEPARTURE_IS_INVALID')
        }
        if (!mongoose.Types.ObjectId(id)) {
          throw new Error('ID_TOUR_DEPARTURE_IS_INVALID')
        }
      }

      if (['buyProduct'].includes(value)) {
        const { id } = req.body
        if (!id) {
          throw new Error('ID_PRODUCT_IS_INVALID')
        }
        if (!mongoose.Types.ObjectId(id)) {
          throw new Error('ID_PRODUCT_IS_INVALID')
        }
      }
      return true
    }),
  check('id').optional(),
  check('payAmount').optional(),
  check('amount').optional(),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

module.exports = { validatePayIntent }
