/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const utils = require('../../../../middleware/utils')
const db = require('../../../../middleware/db')
const modelTour = require('../../../../models/tour')

const serviceDisabledOutDated = (currentToursContiki = []) =>
  new Promise(async (resolve, reject) => {
    try {
      const allOwnTours = await db.find(
        { idExternal: { $exists: true } },
        modelTour,
        'idExternal idOptionTour status'
      )
      console.log('allOwnTours', allOwnTours.length)
      console.log('currentToursContiki', currentToursContiki.length)
      const toDisable = allOwnTours.filter(
        (i) =>
          !_.find(
            currentToursContiki,
            (o) =>
              i.idExternal === o.idExternal && i.idOptionTour === o.idOptionTour
          )
      )
      // const allDepartures = await db.find({ idTour }, modelDeparture, '_id status')
      if (toDisable.length) {
        for (let index = 0; index < toDisable.length; index++) {
          const { _id, status } = toDisable[index]
          if (status === 'publish') {
            await db
              .updateItem(`${_id}`, modelTour, { status: 'construction' })
              .then(() => {
                // console.log('se actualizo la el tour', res.slug)
              })
              .catch((err) => {
                console.log(err, _id)
              })
          }
        }
      }
      resolve({})
    } catch (error) {
      utils.buildErrObjectReject(
        error,
        reject,
        '422',
        'ERROR_DISABLED_DEPARTURES'
      )
    }
  })

module.exports = { serviceDisabledOutDated }
