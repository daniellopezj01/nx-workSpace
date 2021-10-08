/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const geo = require('mapbox-geocoding')
const _ = require('lodash')
const db = require('../middleware/db')
const countriesModel = require('../models/countries')

geo.setAccessToken(process.env.KEY_MAP_BOX)

const getCoordinate = (objectPlace) => new Promise(async (resolve, reject) => {
  try {
    const { name, countryCode } = objectPlace
    let query = name
    let countryName
    if (countryCode) {
      const country = await db.findOne({ code: countryCode }, countriesModel)
      countryName = country.name_en
      query = query.replace(/[^a-zA-Z ]/g, ' ')
      query = `${query}, ${countryName}`
    }
    geo.geocode('mapbox.places', query, (err, res) => {
      if (err) {
        console.log(query, err)
        reject(err)
      }
      if (res) {
        const { features } = res
        const item = _.head(features)
        resolve({
          country: countryName,
          city: name,
          countryCode,
          coordinates: _.reverse(item.center)
        })
      } else {
        reject('ERROR_LOCATION')
      }
    })
  } catch (error) {
    reject({ error: 'ERROR_GET_LOCATION' })
  }
})

module.exports = { getCoordinate }
