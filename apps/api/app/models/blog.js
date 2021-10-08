const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')

const blogScheman = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    userCreator: {
      type: Object,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    customData: {
      type: Object
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

blogScheman.plugin(mongoose_delete, { overrideMethods: true })
blogScheman.plugin(mongoosePaginate)
module.exports = mongoose.model('blog', blogScheman)
