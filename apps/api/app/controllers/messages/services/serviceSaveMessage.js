const utils = require('../../../middleware/utils')
const db = require('../../../middleware/db')
const model = require('../../../models/conversation')
const { helperStructureMessage } = require('../helpers')

const serviceSaveMessage = (data, id) => new Promise(async (resolve, reject) => {
  const body = {
    $push: {
      messages: {
        $each: [await helperStructureMessage(data.message, id)],
        $position: 0
      }
    }
  }
  await db
    .updateByOtherField({ hash: data.hash }, model, body)
    .then((res) => {
      resolve(res)
    })
    .catch((err) => {
      reject(utils.buildErrObject(422, err.message))
    })
})

module.exports = { serviceSaveMessage }
