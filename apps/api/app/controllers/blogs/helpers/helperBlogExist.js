const model = require('../../../models/blog')
const utils = require('../../../middleware/utils')

const helperBlogExist = async (slug) => {
  return new Promise((resolve, reject) => {
    model.findOne(
      {
        slug
      },
      (err, item) => {
        utils.itemAlreadyExists(err, item, reject, 'BLOG_ALREADY_EXISTS')
        resolve(false)
      }
    )
  })
}

module.exports = {
  helperBlogExist
}
