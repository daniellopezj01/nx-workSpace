const mongoose = require('mongoose')
const utils = require('../../../../middleware/utils')
const modelCategory = require('../../../../models/category')
const db = require('../../../../middleware/db')

const filterCategories = (slug, array = undefined) => new Promise(async (resolve, reject) => {
  try {
    const category = await db.findOne({ slug }, modelCategory)
    const query = {
      category: {
        $elemMatch: {
          $eq: mongoose.Types.ObjectId(category._id)
          // $eq: mongoose.Types.ObjectId(idCategory)
        }
      }
    }
    resolve(array ? [...array, query] : query)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'NOT_FOUND_CATEGORY_IN_FILTER')
  }
})

module.exports = { filterCategories }
