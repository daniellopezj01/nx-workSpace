/* eslint-disable @typescript-eslint/no-empty-function */
const model = require('../../../models/itinerary')

const helperUpdateSort = (ids) => {
  ids.forEach((element, index) => {
    model.findByIdAndUpdate(element, { sort: parseInt(index) }, () => { })
  })
}

module.exports = { helperUpdateSort }
