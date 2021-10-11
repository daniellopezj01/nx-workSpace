const nano = require('nanoid/non-secure')
const modelTour = require('../../../models/tour')
const db = require('../../../middleware/db')

const helperTourName = (name) => new Promise(async (resolve) => {
  let title = name
  if (await db.findOneBoolean({ title: name }, modelTour)) {
    title = `${title}-${nano.customAlphabet('1234567890', 2)()}`
  }
  resolve(title)
})

module.exports = { helperTourName }
