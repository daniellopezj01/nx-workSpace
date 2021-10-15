/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
const mime = require('mime')
const model = require('../../models/storage')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperStructureObject } = require('./helpers')

const {
  serviceWriteResizeImages,
  serviceLoadImageS3,
  serviceWriteFile
} = require('./services')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, res) => {
  try {
    if (!req.files) {
      return utils.handleError(res, {
        code: 400,
        message: 'No files were uploaded.'
      })
    }
    const { files = [] } = req
    if (!files['file[]']) {
      return utils.handleError(res, {
        code: 422,
        message: 'Param file[] required'
      })
    }
    const { _id } = req.user
    const listFiles = Array.isArray(files['file[]'])
      ? files['file[]']
      : [files['file[]']]
    if (!listFiles.length) {
      return utils.handleError(res, {
        code: 400,
        message: 'No files were uploaded.'
      })
    }
    const data = await Promise.all(
      listFiles.map(async (file) => {
        let objectFile = {}
        if (file.mimetype.includes('image')) {
          objectFile = await serviceWriteResizeImages(file)
          objectFile = await serviceLoadImageS3(objectFile)
        } else {
          objectFile = await serviceWriteFile(file)
        }
        objectFile.mimetype = mime.getType(file.name)
        objectFile.userId = _id
        return await db.createItem(objectFile, model)
      })
    )
    res.status(200).json(await helperStructureObject(data))
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { createItem }
