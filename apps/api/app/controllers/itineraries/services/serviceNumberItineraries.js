/* eslint-disable handle-callback-err */
const mongoose = require('mongoose')
const model = require('../../../models/itinerary')

const serviceNumberItineraries = (idTour) =>
  new Promise(async (resolve, reject) => {
    try {
      const params = [
        {
          $match: {
            idTour: mongoose.Types.ObjectId(idTour)
          }
        },
        {
          $project: {
            _id: 1
          }
        }
      ]
      model.aggregate(params).exec((err, res) => {
        if (res && res.length) {
          resolve(res)
        } else {
          resolve([])
        }
      })
    } catch (e) {
      reject(e)
    }
  })

module.exports = { serviceNumberItineraries }
