/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
const { helperStructureFlight } = require('./helperStructureFlight')

const helperOriginDestination = (schedules, segments, OriginDestinationInformation) => new Promise(async (resolve, reject) => {
  try {
    const arrayOriginDestination = []
    for (let i = 0; i < schedules.length; i++) {
      const itemSchedule = schedules[i]
      const infoOriginDestination = OriginDestinationInformation[i]
      const currentDate = infoOriginDestination.DepartureDateTime
      const itemOriginDestination = {
        ...infoOriginDestination,
        RPH: `${i + 1}`
      }
      const currentSegment = segments[i]
      const flights = []
      // console.log('longuitud de itemSchedule', itemSchedule.length)
      for (let indexInternal = 0; indexInternal < itemSchedule.length; indexInternal++) {
        const singleFlight = itemSchedule[indexInternal]
        const classOfService = currentSegment.segments[indexInternal].segment.bookingCode
        const flight = await helperStructureFlight(singleFlight, currentDate, classOfService)
        // console.log('valor de flight', flight)
        flights.push(flight)
      }
      itemOriginDestination.TPA_Extensions = {
        SegmentType: {
          Code: 'O'
        },
        Flight: flights
      }
      arrayOriginDestination.push(itemOriginDestination)
    }
    console.log('************RETORNA EL VALOR************')
    resolve(arrayOriginDestination)
  } catch (error) {
    console.log('helperOriginDestination', error.message)
    reject('HELPER_ORIGIN_DESTINATION')
  }
})

module.exports = { helperOriginDestination }
