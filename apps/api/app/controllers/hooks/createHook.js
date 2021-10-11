/* eslint-disable camelcase */
const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const Hook = require('../../models/hooks')
const { webHooks } = require('../../services/hookService')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createHook = async (req, res) => {
  try {
    let { machine } = req
    req = matchedData(req)
    const { target_url, action_trigger } = req
    const newTrigger = { url: target_url, trigger: action_trigger }
    machine = machine._doc
    if (machine?.sources) {
      machine.sources.push(newTrigger)
      await db.updateItem(machine._id, Hook, machine)
      webHooks.add(action_trigger, target_url).then(() => {
        console.log(`Hook loaded ${action_trigger} -- ${target_url}`)
      })
      res.status(201).json(newTrigger)
    } else {
      utils.handleError(res, utils.buildErrObject(422, 'ERROR_WITH_WEBHOOKS_CREATED'))
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { createHook }
