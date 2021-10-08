const { nanoid } = require('nanoid')
const { lookupCheckConversation } = require('./lookup')
const { helperStructureMessage } = require('../helpers')
const model = require('../../../models/conversation')
const db = require('../../../middleware/db')
const { serviceSaveMessage } = require('./serviceSaveMessage')

const serviceCheckOrCreateConversation = (data, user, to) => new Promise(async (resolve) => {
  const idCreator = user._id
  const idTo = to._id
  const conversation = await lookupCheckConversation(idCreator, idTo)
  if (conversation) {
    data.hash = conversation[0].hash
    resolve(await serviceSaveMessage(data, idCreator))
  } else {
    const req = {
      messages: await helperStructureMessage(data.message, idCreator),
      hash: nanoid(),
      members: [idCreator, idTo]
    }
    resolve(await db.createItem(req, model))
  }
})

module.exports = { serviceCheckOrCreateConversation }
