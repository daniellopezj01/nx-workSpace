/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
/* eslint-disable no-return-await */
const _ = require('lodash')
const model = require('../../models/storage')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')

const { serviceDownloadImage } = require('./services')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */

const newSize = async (req, res) => {
  try {
    let data = await db.find({}, model, 'originalPath')
    data = _.filter(data, ({ originalPath }) => originalPath.split(':')[0] === 'https')
    res.status(200).json({ message: 'BEGIN_RESIZE' })
    for (let i = 0; i < data.length; i++) {
      const element = data[i]
      const sizeToLoad = ['smPath']
      await serviceDownloadImage(element.originalPath, sizeToLoad)
        .then(async (object) => {
          const newObject = _.pick(object, sizeToLoad)
          await db.updateItem(element._id, model, newObject)
          console.log(`${i} --> ${element._id}`)
        })
        .catch(() => {
          console.log('fallo el item', element._id)
        })
    }
    console.log('COMPLETED_RESIZE')
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { newSize }
