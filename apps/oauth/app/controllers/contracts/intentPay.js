/* eslint-disable radix */
/* eslint-disable no-unused-vars */
const _ = require('lodash')
const { matchedData } = require('express-validator')
const { handleError, parseJson } = require('../../middleware/utils')
const { emitterWebHooks } = require('../../service/hooks')
const {
  allContracts,
  getHookDeparture,
  checkDepartureContract,
  calculateOthers
} = require('./service')
const { createPayIntention } = require('./service')

const { findUserByAccessToken } = require('../auth/helpers')

/**
 * Check is accumulate
 */

const checkLevel = (contractDeparture, contractPerUser) => {
  try {
    if (!contractDeparture) {
      return contractPerUser
    }
    const { allowToAccumulate } = contractDeparture
    return allowToAccumulate ? contractPerUser : []
  } catch (e) {
    return null
  }
}

/**
 * Listener events HOOK
 */

const listenerBuyTour = (res, payAmount) => new Promise((resolve, reject) => {
  /**
     * If APIHUB response OK 200, 201
     */
  emitterWebHooks.on('*.success', async (shortName, statusCode, body) => {
    const dataParse = parseJson(body)
    const contractsDeparture = _.find(dataParse.payAmount, {
      percentageAmount: parseInt(payAmount)
    })

    // console.log('---->>>',contractsDeparture)
    const calculate = await checkDepartureContract(
      contractsDeparture,
      dataParse.normalPrice
    )
    resolve({ calculate, body: dataParse })
  })
  /**
     * If APIHUB response FAILUER  400, 404 etc
     */
  emitterWebHooks.on('*.failure', (shortName, statusCode, body) => {
    reject({ code: 422, message: 'ERROR_WITH_OAUTH_SERVICE' })
  })
})

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const intentPay = async (req, res) => {
  try {
    const { currentMachine } = req
    req = matchedData(req)
    const { intent, id, payAmount } = req
    listenerBuyTour(res, payAmount)
      .then(async (perDeparture) => {
        const rawResponse = perDeparture
        perDeparture = perDeparture.calculate
        const contractAccumulate = await allContracts(true, intent)
        const contractNotAccumulate = await allContracts(false, intent)
        const perUser = {
          contractAccumulate: _.isEmpty(contractNotAccumulate)
            ? contractAccumulate
            : [],
          contractNotAccumulate
        }
        const omitIfDeparture = {
          perDeparture: perDeparture || [],
          perUser: checkLevel(perDeparture, perUser)
        }
        const bodyResponse = {
          contracts: omitIfDeparture,
          resume: calculateOthers(omitIfDeparture, rawResponse),
          total: calculateOthers(omitIfDeparture, rawResponse, true)
        }
        const payIntention = await createPayIntention(bodyResponse, req)
        res.status(200).json(payIntention)
      })
      .catch((err) => {
        console.log(err.message)
        handleError(res, err)
      })
    await getHookDeparture(id, payAmount, currentMachine)
  } catch (error) {
    console.log(error.message)
    handleError(res, error)
  }
}

module.exports = { intentPay }
