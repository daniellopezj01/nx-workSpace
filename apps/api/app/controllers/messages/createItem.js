/* eslint-disable consistent-return */
/* eslint-disable max-statements */
const { matchedData } = require('express-validator')
const _ = require('lodash')
const model = require('../../models/conversation')
const UserModel = require('../../models/user')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { serviceGetItems } = require('../conversations/services')
const { helperStructureMessage } = require('./helpers')
const { serviceCheckOrCreateConversation } = require('./services')
const socketService = require('../../services/socket.service')
/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, res) => {
  try {
    // const locale = req.getLocale()
    const data = matchedData(req)
    let response
    if (data?.hash) {
      const userId = req.user._id
      const isMyConversation = await serviceGetItems(data, userId)
      if (isMyConversation.code) {
        return res
          .status(422)
          .json({ errors: { msg: 'NOT_YOUR_CONVERSATION' } })
      }
      const body = {
        $push: {
          messages: {
            $each: [await helperStructureMessage(data.message, userId)],
            $position: 0
          }
        }
      }
      const { hash } = data
      response = await db.updateByOtherField({ hash }, model, body)
      response.messages = _.slice(response.messages, 0, 1)
      socketService.emitEventToUsers({
        event: 'new_message',
        payload: response
      })
      res.status(201).json(response)
    } else {
      const id = await utils.isIDGood(data.to)
      const toUser = await db.getItem(id, UserModel)
      response = await serviceCheckOrCreateConversation(data, req.user, toUser)
      socketService.emitEventToUsers({
        event: 'new_message',
        payload: response
      })
      res.status(201).json(response)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { createItem }
