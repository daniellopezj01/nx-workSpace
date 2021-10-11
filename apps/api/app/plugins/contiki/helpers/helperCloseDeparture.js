const moment = require('moment')

const helperCloseDeparture = (endDate) => new Promise((resolve) => {
  const newDate = moment(endDate, 'YYYY-MM-DD').subtract(45, 'days').format('DD-MM-YYYY')
  resolve(newDate.toString())
})

module.exports = { helperCloseDeparture }
