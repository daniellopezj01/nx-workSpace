const _ = require('lodash')
const utils = require('../../../../middleware/utils')

const helperPnrAirBook = (flightOrder, passengers) => new Promise((resolve, reject) => {
  try {
    const HaltOnStatus = [
      {
        Code: 'HL'
      },
      {
        Code: 'KK'
      },
      {
        Code: 'LL'
      },
      {
        Code: 'NN'
      },
      {
        Code: 'NO'
      },
      {
        Code: 'UC'
      },
      {
        Code: 'US'
      }
    ]
    const { originalDestination } = flightOrder
    const flights = []
    _.map(originalDestination, (currentItem) => {
      const currentFlights = currentItem.TPA_Extensions.Flight
      _.map(currentFlights, (o) => {
        const {
          // eslint-disable-next-line no-unused-vars
          Number, Airline, DestinationLocation, ArrivalDateTime, OriginLocation, DepartureDateTime, ClassOfService
        } = o
        flights.push({
          DepartureDateTime,
          FlightNumber: Number.toString(),
          NumberInParty: `${passengers.length}` || '1',
          ResBookDesigCode: ClassOfService,
          Status: 'NN',
          // InstantPurchase: true,
          DestinationLocation,
          MarketingAirline: {
            Code: Airline.Marketing,
            FlightNumber: Number.toString()
          },
          MarriageGrp: 'O',
          OriginLocation
        })
      })
    })
    resolve({
      HaltOnStatus,
      OriginDestinationInformation: {
        FlightSegment: flights
      },
      RedisplayReservation: {
        NumAttempts: 2,
        WaitInterval: 3000
      }
    })
  } catch (error) {
    console.log('ERROR_MAPPING_AIR_BOOK', error.message)
    utils.buildErrObjectReject(error, reject, 422, 'ERROR_MAPPING_AIR_BOOK')
  }
})

module.exports = { helperPnrAirBook }
