/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const { serviceDepartureStructure } = require('./serviceDepartureStructure')
const db = require('../../../middleware/db')
const departureModel = require('../../../models/departure')

const serviceDepartureManager = (seasons, tour) => new Promise(async (resolve, reject) => {
  try {
    let departures = []
    _.map(seasons, (i) => { departures = _.concat(departures, i.departures) })
    departures = _.uniqBy(departures, (i) => i.id)
    const ids = []
    for (let i = 0; i < departures.length; i++) {
      const element = departures[i]
      const departure = await serviceDepartureStructure(element, tour)
      const {
        idTour, idTourExternal, idOptionTour, idExternal
      } = departure
      const filter = {
        idTour, idTourExternal, idOptionTour, idExternal
      }
      const checkDeparture = await db.findOneBoolean(filter, departureModel)
      if (checkDeparture) {
        await db.updateItem(checkDeparture._id, departureModel, departure).then(({ _id: idDeparture }) => {
          ids.push(`${idDeparture}`)
        })
          .catch((err) => { console.log('error update departure', err.message) })
      } else {
        await db.createItem(departure, departureModel).then(({ _id: idDeparture }) => {
          ids.push(`${idDeparture}`)
        })
          .catch((err) => { console.log('error create departure', err.message) })
      }
    }
    resolve(ids)
  } catch (error) {
    reject({ error: 'ERROR_STRUCTURE_DEPARTURES' })
  }
})

module.exports = { serviceDepartureManager }
