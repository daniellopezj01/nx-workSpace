/* eslint-disable camelcase */
const utils = require('../../middleware/utils')

const modelValidateSearch = require('../../models/validateFlights')
const {
  serviceRequestValidateSearch
} = require('./services/servicesValidateSearch')
const db = require('../../middleware/db')
const { helperIncludedMainAirline } = require('./helpers/HelperValidateSearch')

const validateSearch = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const { adults, children } = params
      let objectData = await serviceRequestValidateSearch(params).catch(
        (err) => {
          utils.buildErrObjectReject(
            err,
            reject,
            '422',
            'REQUEST_ERROR_VALIDATE_SEARCH'
          )
        }
      )
      const { schedules, OTA_AirLowFareSearchRQ, codeItinerary } = params
      const dataAirline = await helperIncludedMainAirline(objectData.data)
      // const includedMainAirline = await helperIncludedMainAirline(objectData.data)
      objectData = {
        ...objectData,
        schedules,
        originalDestination:
          OTA_AirLowFareSearchRQ.OriginDestinationInformation,
        codeItinerary,
        adults: parseFloat(adults),
        childrens: parseFloat(children),
        ...dataAirline
      }
      let data = await db.createItem(objectData, modelValidateSearch)
      data = data._doc
      resolve({ ...data, ...objectData })
    } catch (error) {
      utils.buildErrObjectReject(
        error,
        reject,
        '422',
        'CATCH_ERROR_VALIDATE_SEARCH'
      )
    }
  })

module.exports = { validateSearch }
