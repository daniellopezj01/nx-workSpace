const { matchedData } = require('express-validator')
const model = require('../../models/user')
const utils = require('../../middleware/utils')
const emailer = require('../../middleware/emailer')
const db = require('../../middleware/db')
const { helperDetecChangeRole } = require('./helpers')
const { webHooks } = require('../../services/hookService')

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateItem = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await utils.isIDGood(req.id)
    const doesEmailExists = await emailer.emailExistsExcludingMyself(
      id,
      req.email
    )
    if (!doesEmailExists) {
      const roleChange = await helperDetecChangeRole(id, req)
      res.status(200).json(await db.updateItem(id, model, req))
      if (roleChange) {
        webHooks.trigger('role.change', roleChange)
        console.log('webHook: role.change')
      }
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { updateItem }
