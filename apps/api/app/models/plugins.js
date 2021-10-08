const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const mongooseDelete = require('mongoose-delete')

const PluginsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true,
      unique: true
    },
    features: {
      type: Object,
      required: true,
      default: {}
    },
    customData: {
      type: Object,
      default: {}
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
PluginsSchema.plugin(mongoosePaginate)
// PluginsSchema.plugin(mongoTenant)
PluginsSchema.plugin(mongooseDelete)
module.exports = mongoose.model('Plugins', PluginsSchema)
