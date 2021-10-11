const { matchedData } = require('express-validator')
const db = require('../../middleware/db')
const utils = require('../../middleware/utils')
const modelTicket = require('../../models/supportTicket')
const { createObjectMessage } = require('./helpers/index')
const { emailSupport } = require('../../middleware/emailer/index')

const changeObjectTicket = (ticket, user, message) => new Promise(async (resolve, reject) => {
  try {
    let newObject
    const { messages } = ticket
    messages.push(message)
    newObject = {
      ...ticket,
      messages
    }
    newObject = newObject._doc
    newObject.userShouldSend = true
    resolve(newObject)
  } catch (error) {
    console.log(error.message)
    reject()
  }
})

const createItemAdmin = async (req, res) => {
  try {
    const locale = req.getLocale()
    const { user } = req
    const data = matchedData(req)
    const { id, message } = data
    const newMessage = await createObjectMessage(message, user)
    const item = await db.getItem(id, modelTicket)
    const newTicket = await changeObjectTicket(item, user, newMessage)
    const { _id } = newTicket
    const ticket = await db.updateItem(_id, modelTicket, newTicket)
    res.status(200).json(ticket)
    emailSupport(locale, ticket, 'new_message_admin', message)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { createItemAdmin }
