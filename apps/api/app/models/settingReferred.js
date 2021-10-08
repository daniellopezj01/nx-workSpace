/* eslint-disable camelcase */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const mongoose_delete = require('mongoose-delete')

const referredScheman = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    amountFrom: {
      type: Number,
      required: true,
      default: 0
    },
    amountTo: {
      type: Number,
      required: true,
      default: 0
    },
    withdraw: {
      type: Boolean,
      default: false
    },
    default: {
      type: Boolean,
      default: false,
      required: true
    },
    terms: {
      type: String,
      default: ''
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

referredScheman.plugin(mongoosePaginate)
referredScheman.plugin(mongoose_delete, { overrideMethods: true })
module.exports = mongoose.model('referredsettings', referredScheman)
