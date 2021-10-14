const utils = require('../../../../middleware/utils')
const {
  helperPnrPassengersInfo,
  helperPnrAirPrice,
  helperPnrAirBook,
  helperPnrAgencyInfo,
  helperSpecialRequestDetails
} = require('../../helpers/helperPNR')

const serviceStructurePnr = (flightOrder) =>
  new Promise(async (resolve, reject) => {
    try {
      const { passengers } = flightOrder
      const generalInfoPassengers = await helperPnrPassengersInfo(passengers)
      const generalInfoAgency = await helperPnrAgencyInfo()
      const objectAirBook = await helperPnrAirBook(flightOrder, passengers)
      const infoAirPrice = await helperPnrAirPrice(
        passengers,
        flightOrder.data[0]
      )
      const objectRequestDetails = await helperSpecialRequestDetails(
        flightOrder
      )
      const newParams = {
        CreatePassengerNameRecordRQ: {
          version: '2.4.0',
          targetCity: process.env.SABRE_PCC,
          TravelItineraryAddInfo: {
            AgencyInfo: generalInfoAgency,
            CustomerInfo: generalInfoPassengers
          },
          AirBook: objectAirBook,
          AirPrice: infoAirPrice,
          SpecialReqDetails: objectRequestDetails,
          PostProcessing: {
            RedisplayReservation: {
              waitInterval: 100
            },
            EndTransaction: {
              Source: {
                ReceivedFrom: 'API'
              }
            }
          }
        }
      }
      // console.log(JSON.stringify(newParams, null, 2))
      resolve(newParams)
    } catch (error) {
      utils.buildErrObjectReject(error, reject, '422', 'ERROR_GET_DATA_SABRE')
    }
  })

module.exports = { serviceStructurePnr }
