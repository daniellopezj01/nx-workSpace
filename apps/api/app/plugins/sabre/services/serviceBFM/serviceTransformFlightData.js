/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const _ = require('lodash')
const utils = require('../../../../middleware/utils')
const { helperTransformPrice } = require('../../helpers/helperBFM')

const serviceTransformFlightData = ({ groupedItineraryResponse }, transformPrice = false) => new Promise(async (resolve, reject) => {
  try {
    const {
      scheduleDescs, legDescs, itineraryGroups, messages
    } = groupedItineraryResponse
    const globalItineraries = _.head(itineraryGroups)
    if (globalItineraries) {
      const { itineraries } = globalItineraries
      const data = []
      for (let j = 0; j < itineraries.length; j++) {
        let item = itineraries[j]
        const { legs, pricingInformation } = item
        const priceData = await helperTransformPrice(pricingInformation, transformPrice)
        item = { ...item, ...priceData } // extraer precios
        const fn = _.spread(_.union)
        item.schedules = _.map(legs, (i) => {
          const itemLegs = _.find(legDescs, (o) => i.ref === o.id)
          if (itemLegs) {
            const { schedules } = itemLegs
            return _.map(schedules, (s) => {
              const schedule = _.find(scheduleDescs, (sh) => s.ref === sh.id)
              // if (s?.departureDateAdjustment) {
              //   console.log(`itinerario ${item.id} schedule ${schedule.id}`)
              // }
              return { ...schedule, departureDateAdjustment: s?.departureDateAdjustment }
            })
          }
        })
        item.segments = _.head(pricingInformation).fare.passengerInfoList[0].passengerInfo.fareComponents
        item.schedules = fn(item.schedules)
        data.push(_.pick(item, ['id', 'price', 'schedules', 'currencyConversion', 'segments']))
      }
      resolve(data)
    } else {
      _.map(messages, (i) => { console.log('message', i) })
      reject(utils.buildErrObject('422', 'ERROR_GET_DATA_SABRE'))
    }
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_GET_DATA_SABRE')
  }
})

module.exports = { serviceTransformFlightData }
