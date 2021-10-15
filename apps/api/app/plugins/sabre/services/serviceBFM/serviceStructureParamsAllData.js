const _ = require('lodash')
const moment = require('moment')
const utils = require('../../../../middleware/utils')

const serviceStructureParamsAllData = (params) =>
  new Promise(async (resolve, reject) => {
    try {
      const { segments, adultsCount, childrenCount } = params
      const flights = _.map(segments, (i, index) => {
        return {
          DepartureDateTime: moment(i.date, 'YYYY-MM-DD').format(
            'YYYY-MM-DD[T]HH:mm:ss'
          ),
          DestinationLocation: {
            LocationCode: i.destination
          },
          OriginLocation: {
            LocationCode: i.origin
          },
          RPH: index.toString()
        }
      })
      const persons = []
      if (parseFloat(adultsCount)) {
        persons.push({
          Code: 'ADT',
          Quantity: parseFloat(adultsCount)
        })
      }
      if (parseFloat(childrenCount)) {
        persons.push({
          Code: 'CNN',
          Quantity: parseFloat(childrenCount)
        })
      }
      const generalParams = {
        OTA_AirLowFareSearchRQ: {
          OriginDestinationInformation: flights,
          POS: {
            Source: [
              {
                PseudoCityCode: process.env.SABRE_PCC,
                RequestorID: {
                  CompanyName: {
                    Code: 'TN'
                  },
                  ID: '1',
                  Type: '1'
                }
              }
            ]
          },
          TravelPreferences: {
            TPA_Extensions: {
              DataSources: {
                ATPCO: 'Enable'
              }
            }
          },
          TravelerInfoSummary: {
            AirTravelerAvail: [
              {
                PassengerTypeQuantity: persons
              }
            ],
            PriceRequestInformation: {
              CurrencyCode: 'USD',
              TPA_Extensions: {}
            }
          },
          TPA_Extensions: {
            IntelliSellTransaction: {
              RequestType: {
                Name: process.env.ITINERARY_NUMBER
              }
            }
          },
          Version: '4'
        }
      }
      // console.log(JSON.stringify(generalParams, null, 2))
      resolve(generalParams)
    } catch (error) {
      utils.buildErrObjectReject(error, reject, '422', 'ERROR_PARAMS_STRUCTURE')
    }
  })

module.exports = { serviceStructureParamsAllData }
