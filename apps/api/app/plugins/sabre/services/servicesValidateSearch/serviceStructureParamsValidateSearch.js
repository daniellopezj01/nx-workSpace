/* eslint-disable max-len */
/* eslint-disable camelcase */
const utils = require('../../../../middleware/utils')
const { helperOriginDestination } = require('../../helpers/HelperValidateSearch')

const serviceStructureParamsValidateSearch = (params) => new Promise(async (resolve, reject) => {
  try {
    const {
      OTA_AirLowFareSearchRQ, schedules, segments, adults, children
    } = params
    const { OriginDestinationInformation } = OTA_AirLowFareSearchRQ
    if (schedules) {
      const persons = []
      if (parseFloat(adults)) {
        persons.push({
          Code: 'ADT',
          Quantity: parseFloat(adults)
        })
      }
      if (parseFloat(children)) {
        persons.push({
          Code: 'CNN',
          Quantity: parseFloat(children)
        })
      }
      OTA_AirLowFareSearchRQ.OriginDestinationInformation = await helperOriginDestination(schedules, segments, OriginDestinationInformation)
      OTA_AirLowFareSearchRQ.TPA_Extensions = {
        IntelliSellTransaction: {
          RequestType: {
            Name: process.env.ITINERARY_NUMBER
          }
        }
      }
      OTA_AirLowFareSearchRQ.Version = '6.1.0'
      OTA_AirLowFareSearchRQ.TravelPreferences = {
        TPA_Extensions: {
          VerificationItinCallLogic: {
            Value: 'B'
          }
        }
      }
      OTA_AirLowFareSearchRQ.TravelerInfoSummary = {
        AirTravelerAvail: [
          {
            PassengerTypeQuantity: persons
          }
        ],
        PriceRequestInformation: {
          CurrencyCode: 'USD',
          TPA_Extensions: {}
        }
      }
    }
    resolve({ OTA_AirLowFareSearchRQ })
  } catch (error) {
    console.log('serviceStructureParamsValidateSearch', error.message)
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_PARAMS_STRUCTURE')
  }
})

module.exports = { serviceStructureParamsValidateSearch }
