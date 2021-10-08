/* eslint-disable camelcase */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
const mongoose_delete = require('mongoose-delete')
const nano = require('nanoid/non-secure')

const commentsSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => nano.customAlphabet('CM1234567890', 8)()
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      lowercase: true,
      enum: ['publish', 'draft'],
      default: 'publish'
    },
    tags: {
      type: [String],
      default: []
    },
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    idReservation: {
      type: mongoose.Types.ObjectId
    },
    vote: {
      type: Number,
      default: 0
    },
    attachment: {
      type: Object
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

commentsSchema.plugin(aggregatePaginate)
commentsSchema.plugin(mongoosePaginate)
commentsSchema.plugin(mongoose_delete, { overrideMethods: true })

module.exports = mongoose.model('comment', commentsSchema)
