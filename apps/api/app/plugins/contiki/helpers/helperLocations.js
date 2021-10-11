const _ = require('lodash')

const getContinentsAndCountries = (countriesVisited, continentsdb) => new Promise(async (resolve) => {
  const countries = countriesVisited.length
  const continent = []
  for (let i = 0; i < countriesVisited.length; i++) {
    const element = countriesVisited[i]
    const current = _.find(continentsdb, (o) => o.english === element.continent)
    if (current) {
      continent.push(current.code)
    }
  }
  resolve({
    countries,
    continent
  })
})

const getRouteAndCities = (itinerary) => new Promise(async (resolve) => {
  let allLocations = []
  for (let i = 0; i < itinerary.length; i++) {
    const element = itinerary[i]
    const { locationsVisited } = element
    allLocations = _.concat(allLocations, locationsVisited)
  }
  const compact = _.uniqBy(allLocations, (i) => i.name)
  let route = ''
  _.map(compact, (i) => {
    route = `${route} ${i.name}, `
  })
  route = route.slice(0, -2)
  resolve({
    cities: compact.length,
    route
  })
})

const helperLocations = (data, continents) => new Promise(async (resolve) => {
  const { countriesVisited, itinerary } = data
  resolve({
    ...await getContinentsAndCountries(countriesVisited, continents),
    ...await getRouteAndCities(itinerary)
  })
})

module.exports = { helperLocations }
