const _ = require('lodash')

const helperIncludedMainAirline = (data = []) => new Promise((resolve) => {
  const flight = _.head(data)
  const { schedules } = flight
  const includedMainAirline = _.some(schedules, (i) => i.carrier.operating === process.env.MAIN_AIRLINE)
  const listAirline = _.map(schedules, (i) => i.carrier.operating)

  resolve({ includedMainAirline, listAirline })
})

module.exports = { helperIncludedMainAirline }
