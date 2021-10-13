const mongoose = require('mongoose')

const PayIntentionSchema = new mongoose.Schema(
  {
    idOperation: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    percentage: {
      type: Number,
      required: true,
      default: 100
    },
    resume: {
      type: Object
    },
    total: {
      type: Number,
      required: true
    },
    totalAmountPercentage: {
      type: Number,
      required: true
    },
    origin: {
      type: Array,
      default: ['*']
    },
    accessToken: {
      type: String
    },
    contracts: {
      type: Object,
      default: {}
    },
    status: {
      type: String,
      enum: ['enabled', 'disabled'],
      default: 'enabled'
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

module.exports = mongoose.model('payintention', PayIntentionSchema)
