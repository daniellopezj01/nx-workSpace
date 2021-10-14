const _ = require('lodash')

const helpersItineraryNights = (itineraries) =>
  new Promise((resolve) => {
    resolve(
      _.chain(itineraries)
        .groupBy('locationsVisited.name')
        .map((value, key) => {
          const newValue = _.map(value, (i) => ({
            title: i.title,
            description: i.text[0],
            isNight: true
          }))
          const { locationsVisited } = _.head(value)
          return {
            itineraryName: key,
            details: newValue,
            getLocation: locationsVisited
          }
        })
        .value()
    )
  })

module.exports = { helpersItineraryNights }
