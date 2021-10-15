/* eslint-disable max-statements */
/* eslint-disable prefer-const */
const _ = require('lodash')
const { helperDatesDepartures, helperCloseDeparture } = require('../helpers')

const serviceDepartureStructure = (departureContiki, tour) =>
  new Promise(async (resolve, reject) => {
    try {
      const { _id, idExternal, idOptionTour } = tour
      const { id: idDeparture, sellingRegions } = departureContiki
      const data = _.head(sellingRegions)
      const { startDate, endDate, prices, availability } = data
      const typesRoom = ['twinShare', 'tripleShare', 'multiShare']
      let roomData = _.find(prices, (i) => _.includes(typesRoom, i.roomType))
      if (!roomData) {
        roomData = _.head(prices)
      }
      const { roomType, adultPrice } = roomData
      let { oldFullPrice, base } = adultPrice
      if (!oldFullPrice) {
        oldFullPrice = base
      }
      // const discount = 0
      base = Number(parseFloat(base).toFixed(2))
      const calculatePercentage = Number(parseFloat((199 * 100) / base))
      const departure = {
        startDateDeparture: await helperDatesDepartures(startDate),
        endDateDeparture: await helperDatesDepartures(endDate),
        closeDateDeparture: await helperCloseDeparture(startDate),
        idTour: _id,
        idTourExternal: idExternal,
        idOptionTour,
        idExternal: idDeparture,
        roomType,
        normalPrice: base,
        specialPrice: oldFullPrice,
        maxAge: 35,
        status: availability === 'available' ? 'visible' : 'not_visible',
        payAmount: [
          // {
          //   percentageAmount: 100,
          //   discount: 'amount',
          //   amountDiscount: Number(Math.trunc(oldFullPrice - base), 2),
          //   allowToAccumulate: false
          // },
          {
            percentageAmount: 100,
            discount: 'none',
            amountDiscount: null,
            allowToAccumulate: false
          },
          {
            percentageAmount: calculatePercentage,
            discount: 'none',
            amountDiscount: null,
            allowToAccumulate: false,
            specialPayment: true
          }
        ]
      }
      resolve(departure)
    } catch (error) {
      reject({ error: 'ERROR_STRUCTURE_DEPARTURE' })
    }
  })

module.exports = { serviceDepartureStructure }
