const { matchedData } = require('express-validator')
const _ = require('lodash')
const moment = require('moment')
const utils = require('../../middleware/utils')
const { helperCheckKey } = require('./helpers')
const { serviceItemDepartures } = require('./services')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getTourWithDepartures = async (req, res) => {
  try {
    req = matchedData(req)
    const query = await helperCheckKey(req.query)
    const tour = await serviceItemDepartures(query)
    const { idExternal, idOptionTour } = tour
    if (idExternal || idOptionTour) {
      tour.departures = _.filter(tour.departures, (i) => i.status !== 'not_visible')
    }
    const departures = _.map(
      _.groupBy(
        _.map(_.filter(tour.departures, 'startDateDeparture'), (a) => {
          a.monthYear = a && a.startDateDeparture
            ? moment(a.startDateDeparture, 'DD-MM-YYYY').format('MM-YYYY')
            : null
          a.transformDate = a && a.monthYear ? a.monthYear.split('-') : null
          return a
        }),
        'monthYear'
      ),
      (value, key) => {
        return {
          data: value,
          stringDate: key,
          month: moment(key, 'MM-YYYY').format('MM'),
          year: moment(key, 'MM-YYYY').format('YYYY'),
          date: moment(key, 'MM-YYYY').toDate()
        }
      }
    )
    tour.departures = _.orderBy(departures, ['year', 'month'], ['asc', 'asc'])
    res.status(200).json(tour)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getTourWithDepartures }
