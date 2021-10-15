const { translateSingle } = require('../index')
const { serviceStructureRequestTranslate } = require('../services')

const helperTranslateItinerary = (itinerary) =>
  new Promise(async (resolve, reject) => {
    try {
      const { itineraryName, details } = itinerary
      const translateItineraryName = await translateSingle(itineraryName).catch(
        () => itineraryName
      )
      const translateDetails = await serviceStructureRequestTranslate(details, [
        'title',
        'description'
      ]).catch(() => details)
      resolve({
        ...itinerary,
        itineraryName: translateItineraryName,
        details: translateDetails
      })
    } catch (error) {
      console.log(error)
      reject('ERROR_TRANSLATE_ITINERARY')
    }
  })
module.exports = { helperTranslateItinerary }
