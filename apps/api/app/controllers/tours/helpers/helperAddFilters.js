const _ = require('lodash')
const moment = require('moment')

const helperAddFilters = (tours) => new Promise(async (resolve, reject) => {
  try {
    const data = []
    const filters = {}
    if (tours.length) {
      await Promise.all(
        _.map(tours, async (tour) => {
          _.map(tour.allDepartures, async (departure) => {
            const { startDateDeparture } = departure
            const date = moment(startDateDeparture, 'DD-MM-YYYY').format(
              'YYYY-MM-01'
            )
            data.push(date)
          })
        })
      )
        .then(() => {
          filters.dates = _.orderBy(_.uniq(data))
        })
        .catch((err) => {
          console.log('error in FIlter', err)
        })
    }
    resolve(filters)
  } catch (error) {
    console.log('error filters', error.message)
    reject(error)
  }
})

module.exports = { helperAddFilters }
