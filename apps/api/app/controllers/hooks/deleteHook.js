const { matchedData } = require('express-validator')
const _ = require('lodash')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const Hook = require('../../models/hooks')
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const deleteHook = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    let { machine } = req
    req = matchedData(req)
    machine = machine._doc
    if (machine?.sources) {
      machine.sources = _.remove(machine.sources, {
        url: req.target_url
      })
      await db.updateItem(machine._id, Hook, machine)
      res.status(201).json({ DELETED: 'SUCCESS' })
    } else {
      utils.handleError(res, utils.buildErrObject(422, 'ERROR_WITH_WEBHOOKS_DELETED'))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { deleteHook }
