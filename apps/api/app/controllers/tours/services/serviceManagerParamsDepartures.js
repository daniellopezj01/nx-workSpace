const modelTour = require('../../../models/tour')
const { filterCombineDepartures, mergeToursAndDepartures } = require('../filters')
const utils = require('../../../middleware/utils')
const { queryGetDeparturesForFilter } = require('../filters/queries')
const { customPaginate } = require('../../../middleware/generalFunctions')

const serviceManagerParamsDepartures = (tourAggregate, query) => new Promise(async (resolve, reject) => {
  try {
    const {
      limit, page, minDate, maxDate
    } = query
    const tours = await modelTour.aggregate(tourAggregate)
    const match = await filterCombineDepartures(query)
    const departures = await queryGetDeparturesForFilter(match, minDate, maxDate)
    const transformTours = await mergeToursAndDepartures(tours, departures)
    const dataPaginate = await customPaginate(transformTours, limit, page)
    resolve(dataPaginate)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_SERVICE_MANAGER_PARAMS_DEPARTURES')
  }
})

module.exports = { serviceManagerParamsDepartures }
