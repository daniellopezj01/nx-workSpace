const _ = require('lodash')

const helperDatesDepartures = (date) => new Promise((resolve) => {
  const stringDate = date.split('-')
  let newString = ''
  _.map(stringDate, (i) => {
    newString = `${i}-${newString}`
  })
  resolve(newString.slice(0, -1))
})

module.exports = { helperDatesDepartures }
