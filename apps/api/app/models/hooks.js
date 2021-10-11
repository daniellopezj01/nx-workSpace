const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const HooksSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    source: {
      type: String,
      required: true
    },
    endpoint: {
      type: Array,
      required: true,
      default: []
    },
    headers: {
      type: Object,
      required: false
    },
    mode: {
      type: String,
      enum: ['getContractDeparture']
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
HooksSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Hooks', HooksSchema)
