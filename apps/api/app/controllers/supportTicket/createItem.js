const { matchedData } = require('express-validator')
const db = require('../../middleware/db')
const utils = require('../../middleware/utils')
const modelTicket = require('../../models/supportTicket')
const modelReservation = require('../../models/reservation')
const {
  createObjectMessage,
  createObjectReservation
} = require('./helpers/index')
const { emailSupport } = require('../../middleware/emailer/index')

const changeObjectTicket = (ticket, user, message) => new Promise(async (resolve, reject) => {
  try {
    const { _id } = ticket
    let newObject
    if (_id) {
      const { messages } = ticket
      messages.push(message)
      newObject = {
        ...ticket,
        messages
      }
      newObject = newObject._doc
      newObject.userShouldSend = false
    } else {
      const { codeReservation } = ticket
      const reservation = await db.findOne({ code: codeReservation }, modelReservation)
      const customData = await createObjectReservation(reservation)
      newObject = { ...ticket, customData, messages: [message] }
    }
    resolve(newObject)
  } catch (error) {
    console.log(error.message)
    reject()
  }
})

const createItem = async (req, res) => {
  try {
    const locale = req.getLocale()
    const { user } = req
    const data = matchedData(req)
    const { hash, message } = data
    const newMessage = await createObjectMessage(message, user)
    let ticket
    if (hash) {
      const item = await db.findOne({ hash }, modelTicket)
      const newTicket = await changeObjectTicket(item, user, newMessage)
      const { _id } = newTicket
      ticket = await db.updateItem(_id, modelTicket, newTicket)
      res.status(200).json(ticket)
      console.log('entre cuando hay hash')
      emailSupport(locale, ticket, 'new_message_user', message)
    } else {
      const newTicket = await changeObjectTicket(data, user, newMessage)
      ticket = await db.createItem(newTicket, modelTicket)
      res.status(200).json(ticket)
      emailSupport(locale, ticket, 'new_chat', message)
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { createItem }
