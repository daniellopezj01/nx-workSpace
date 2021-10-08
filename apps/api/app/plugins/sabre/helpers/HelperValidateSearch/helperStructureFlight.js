const { reject } = require('lodash')
const _ = require('lodash')
const { helperStructureTime } = require('./helperStructureTime')

const helperStructureFlight = (singleFlight, currentDate, classOfService) => new Promise(async (resolve) => {
  try {
    const {
      carrier, departure, arrival
    } = singleFlight
    const dates = await helperStructureTime(currentDate, singleFlight)
    // dates = [DEPARTURE, ARRIVAL]
    const flight = {
      Number: carrier.marketingFlightNumber,
      // Number: carrier.operatingFlightNumber,
      DepartureDateTime: _.head(dates),
      ArrivalDateTime: _.last(dates),
      Type: 'A',
      ClassOfService: classOfService, // mapear clase de servicio
      OriginLocation: {
        LocationCode: departure.airport
      },
      DestinationLocation: {
        LocationCode: arrival.airport
      },
      Airline: {
        Operating: carrier.operating,
        Marketing: carrier.marketing
      }
    }
    resolve(flight)
  } catch (error) {
    console.log('helperStructureFlight', error.message)
    reject('HELPER_STRUCTURE_FLIGHT')
  }
})

module.exports = { helperStructureFlight }
