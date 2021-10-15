/* eslint-disable max-statements */
const model = require('../../models/tour')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const {
  serviceGetItems,
  serviceManagerParamsDepartures
} = require('./services')
const { filterMainSearch } = require('./filters')
const { helperAssignedPrice } = require('./helpers')
/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItems = async (req, res) => {
  try {
    const { query } = req
    const match = await filterMainSearch(query)
    const queryAggregate = await serviceGetItems(match)
    let response = {}
    const filtersDeparture = [
      'minPrice',
      'maxPrice',
      'minAge',
      'maxAge',
      'minDate',
      'maxDate'
    ]
    const includeDepartureFilters = filtersDeparture.find(
      (prop) => prop in query
    )
    if (includeDepartureFilters) {
      response = await serviceManagerParamsDepartures(queryAggregate, query)
    } else {
      const aggregate = model.aggregate(queryAggregate)
      response = await db.getItemsAggregate(req, model, aggregate, true)
      // console.log(response)
      if (response.docs.length) {
        response.docs = await helperAssignedPrice(response.docs, false)
      }
    }

    res.status(200).json(response)
  } catch (error) {
    console.log(error.message)
    utils.handleError(res, error)
  }
}

module.exports = { getItems }
