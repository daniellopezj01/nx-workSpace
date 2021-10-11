/* eslint-disable camelcase */
const { matchedData } = require('express-validator')
const { handleError, buildErrObject } = require('../../middleware/utils')
const modelMachines = require('../../models/machines')
const db = require('../../middleware/db')

const { webHooks } = require('../../service/hooks')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createHook = async (req, res) => {
  try {
    const { machine } = req
    req = matchedData(req)
    const { target_url, action_trigger } = req
    const newTrigger = { url: target_url, trigger: action_trigger }
    if (machine?.sources) {
      machine.sources.push(newTrigger)
      await db.updateItem(machine._id, modelMachines, machine)
      webHooks.add(action_trigger, target_url).then(() => {
        console.log(`Hook loaded ${action_trigger} -- ${target_url}`)
      })
      res.status(201).json(newTrigger)
    } else {
      handleError(res, buildErrObject(422, 'ERROR_WITH_WEBHOOKS_CREATED'))
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { createHook }
