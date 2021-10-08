/* eslint-disable camelcase */
const { test } = require('./test')
const { getInfo } = require('./getInfo')
const { updateDepartures } = require('./updateDepartures')
const { disabledTours } = require('./disabledTours')

module.exports = {
  test,
  getInfo,
  updateDepartures,
  disabledTours
}
