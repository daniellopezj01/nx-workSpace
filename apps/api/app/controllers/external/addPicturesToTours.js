/* eslint-disable no-await-in-loop */
const utils = require('../../middleware/utils')
const tourModel = require('../../models/tour')
const db = require('../../middleware/db')
const { serviceTransforAttached, serviceTransforIncluded } = require('./services/serviceAddPictureToTours')

const addPicturesToTours = async (req, res) => {
  try {
    const data = await db.find({ idExternal: { $exists: false } }, tourModel)
    res.status(200).json({ message: 'BEGIN_LOAD_NEW_IMAGES' })
    // for (let i = 0; i < 1; i++) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i]
      const { _id } = element
      let { attached, included } = element
      attached = await serviceTransforAttached(attached)
      included = await serviceTransforIncluded(included)
      await db.updateItem(_id, tourModel, { attached, included })
      console.log(`completed id ${element._id} index ${i}`)
    }
  } catch (error) {
    utils.handleError(res, { code: 404, message: error.message })
  }
}

module.exports = { addPicturesToTours }
