const { validateCreateItem } = require('./validateCreateItem')
const { validateGetTickets } = require('./validateGetTickets')
const { validateGetTicket } = require('./validateGetTicket')
const { validateGetItemAdmin } = require('./validateGetItemAdmin')
const { validateCreateItemAdmin } = require('./validateCreateItemAdmin')

module.exports = {
  validateCreateItem,
  validateGetTickets,
  validateGetTicket,
  validateGetItemAdmin,
  validateCreateItemAdmin
}
