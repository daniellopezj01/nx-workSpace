const { getCoordinate } = require('../../../services/mapboxService')

const serviceItineraryStructure = (itinerary, tour) => new Promise(async (resolve, reject) => {
  try {
    const { getLocation } = itinerary
    const { _id, idExrternal, idOptionTour } = tour
    const StructureItinerary = {
      ...itinerary,
      idTour: _id,
      idTourExternal: idExrternal,
      idOptionTour,
      includedInMap: true,
      stringLocation: await getCoordinate(getLocation)
    }
    delete StructureItinerary.getLocation
    resolve(StructureItinerary)
  } catch (error) {
    reject({ error: 'ERROR_STRUCTURE_ITINERARY' })
  }
})

module.exports = { serviceItineraryStructure }
