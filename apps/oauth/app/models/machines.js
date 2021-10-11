const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const MachinesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    appId: {
      type: String,
      required: true
    },
    appSecret: {
      type: String,
      required: true
    },
    origin: {
      type: Array,
      default: ['*']
    },
    sources: {
      type: Array,
      default: []
    },
    urlRedirect: {
      type: String
    },
    status: {
      type: String,
      enum: ['enabled', 'disabled'],
      default: 'enabled'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

MachinesSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('machines', MachinesSchema)
