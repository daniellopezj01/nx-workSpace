/* eslint-disable camelcase */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
const mongoose_delete = require('mongoose-delete')
const nano = require('nanoid/non-secure')

const ReferredSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => nano.customAlphabet('AB1234567890', 8)()
    },
    userTo: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    userFrom: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    planReferred: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    status: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available'
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
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

ReferredSchema.plugin(aggregatePaginate)
ReferredSchema.plugin(mongoosePaginate)
ReferredSchema.plugin(mongoose_delete, { overrideMethods: true })

module.exports = mongoose.model('referredUser', ReferredSchema)
