const { serviceGetItems } = require('./serviceGetItems')
const { serviceGetItem } = require('./serviceGetItem')
const { serviceGetTourContinents } = require('./serviceGetTourContinents')
const { serviceMainSearch } = require('./serviceMainSearch')
const { serviceItemDepartures } = require('./serviceItemDepartures')
const { serviceTourForReservation } = require('./serviceTourForReservation')
const { serviceGetItemsAdmin } = require('./serviceGetItemsAdmin')
const { serviceGetItemAdmin } = require('./serviceGetItemAdmin')
const { serviceStructureParams } = require('./serviceStructureParams')
const { serviceManagerParamsDepartures } = require('./serviceManagerParamsDepartures')

module.exports = {
  serviceGetItems,
  serviceGetItem,
  serviceGetTourContinents,
  serviceMainSearch,
  serviceItemDepartures,
  serviceTourForReservation,
  serviceGetItemsAdmin,
  serviceGetItemAdmin,
  serviceStructureParams,
  serviceManagerParamsDepartures
}
