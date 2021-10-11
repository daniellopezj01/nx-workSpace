/* eslint-disable no-await-in-loop */
const utils = require('../../../../middleware/utils')
const db = require('../../../../middleware/db')
const modelDeparture = require('../../../../models/departure')
const modelTour = require('../../../../models/tour')

const serviceDisabledDepartures = (idTour, idDepartures = []) => new Promise(async (resolve, reject) => {
  try {
    const allDepartures = await db.find({ idTour }, modelDeparture, '_id status')
    const forDisabled = allDepartures.filter(({ _id }) => {
      return !idDepartures.includes(`${_id}`)
    })
    if (forDisabled.length) {
      for (let index = 0; index < forDisabled.length; index++) {
        const departure = forDisabled[index]
        const { _id, status } = departure
        if (status === 'visible') {
          await db.updateItem(`${_id}`, modelDeparture, { status: 'not_visible' }).then((res) => {
            console.log('se actualizo la salida', res._id)
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    }
    const activeDepartures = await db.find({ idTour, status: 'visible' }, modelDeparture, '_id status')
    if (activeDepartures.length === 0) {
      await db.updateItem(idTour, modelTour, { status: 'construction' })
        .then(() => { console.log('update empty  departures tour', idTour) })
        .catch(() => { console.log('error update empty  departures tour', idTour) })
    }
    resolve({})
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_DISABLED_DEPARTURES')
  }
})

module.exports = { serviceDisabledDepartures }
