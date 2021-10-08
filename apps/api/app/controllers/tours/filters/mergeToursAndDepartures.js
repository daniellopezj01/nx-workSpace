const _ = require('lodash')

const mergeToursAndDepartures = (tours = [], departures = []) => new Promise(async (resolve) => {
  const tourTransform = _.chain(tours).map((tour) => {
    tour.bestDeparture = _.find(departures, (dep) => `${dep.idTour}` === `${tour._id}`)
    return tour
  }).remove((i) => i.bestDeparture).value()
  resolve(tourTransform)
})

module.exports = { mergeToursAndDepartures }
