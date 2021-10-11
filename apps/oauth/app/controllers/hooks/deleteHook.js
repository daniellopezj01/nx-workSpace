const { matchedData } = require('express-validator')
const _ = require('lodash')
const { handleError, buildErrObject } = require('../../middleware/utils')
const db = require('../../middleware/db')
const modelMachines = require('../../models/machines')
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const deleteHook = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const { machine } = req
    req = matchedData(req)
    if (machine?.sources) {
      machine.sources = _.remove(machine.sources, {
        url: req.target_url
      })
      await db.updateItem(machine._id, modelMachines, machine)
      res.status(201).json({ DELETED: 'SUCCESS' })
    } else {
      handleError(res, buildErrObject(422, 'ERROR_WITH_WEBHOOKS_DELETED'))
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { deleteHook }
