const model = require('../../models/settings')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')

/********************
 * Public functions *
 ********************/

exports.checkSingle = async (req, res) => {
  try {
    const data = await db.findCheckSingle(model)
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}
