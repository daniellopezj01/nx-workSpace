/* eslint-disable no-unused-vars */
const _ = require('lodash')

const {
  helperStructureImages,
  helperTourName,
  helperLocations,
  helperTourIncludes
} = require('../helpers')
const { serviceItineraryManager } = require('./serviceItineraryManager')
const { serviceDepartureManager } = require('./serviceDepartureManager')
const { helperTranslateTour } = require('../../deepTranslate/helpers')
const { helperGenereateSlug } = require('../../../controllers/tours/helpers')
const paymentModel = require('../../../models/paymentMethods')

const db = require('../../../middleware/db')
const tourModel = require('../../../models/tour')

const serviceTourStructure = (general, details, continents, agency) => new Promise(async (resolve, reject) => {
  const {
    id, name, brand, content
  } = general
  const { seasons } = details
  const firstSeason = _.head(seasons)
  const data = _.head(firstSeason?.content)
  if (!data?.images) {
    reject('EMPTY_IMAGES')
  } else {
    const mainDetails = _.head(content)
    // const title = await helperTourName(name)
    const title = name
    const slug = await helperGenereateSlug(title)
    const attached = await helperStructureImages(data)

    const filter = { country: 'MX' }
    const paymentStripe = await db.findOneBoolean(filter, paymentModel)
    const { durationMax, description } = mainDetails
    let tour = {
      idExternal: id,
      idOptionTour: details.id,
      title,
      slug,
      status: 'publish',
      fromPlatform: brand,
      duration: durationMax,
      description,
      ownerUser: agency._id,
      attached,
      tags: [],
      paymentMethod: paymentStripe.codePayment,
      lenguages: ['EN'],
      featured: 'regular',
      included: await helperTourIncludes(data),
      notIncluded: [{
        title: 'vuelos internacionales',
        description: 'No incluye vuelos internacionales'
      }],
      ...await helperLocations(data, continents)// { continent, countries, cities, route }
    }
    if (process.env.KEY_TRANSLATE) {
      tour = await helperTranslateTour(tour)
    }
    const checkTour = await db.findOneBoolean({ idOptionTour: details.id }, tourModel)
    if (checkTour) {
      delete tour.slug
      tour = await db.updateItem(checkTour._id, tourModel, tour)
        .catch((err) => { console.log('error update', err.message) })
    } else {
      tour = await db.createItem(tour, tourModel)
        .catch((err) => { console.log('error create ', err.message) })
    }
    await serviceItineraryManager(data, tour).catch((e) => { console.log('itinerary', e.message) })
    await serviceDepartureManager(seasons, tour).catch((e) => { console.log('departure', e.message) })
    resolve(tour)
  }
})

module.exports = { serviceTourStructure }
