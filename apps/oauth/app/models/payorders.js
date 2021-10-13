const mongoose = require('mongoose')

const PayOrdersSchema = new mongoose.Schema(
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

module.exports = mongoose.model('payorders', PayOrdersSchema)
