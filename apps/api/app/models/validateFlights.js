const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')
const nano = require('nanoid/non-secure')

const validateFlightSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => nano.customAlphabet('VF1234567890', 6)()
    },
    params: {
      type: Object,
      required: true
    },
    oldParams: {
      type: Object
    },
    schedules: {
      type: Object
    },
    codeItinerary: {
      type: Number,
      required: true
    },
    originalDestination: {
      type: Object
    },
    paramsPnr: {
      type: Object
    },
    adults: {
      type: Number,
      required: true
    },
    childrens: {
      type: Number,
      required: true
    },
    includedMainAirline: {
      type: Boolean
    },
    listAirline: {
      type: Array
    },
    data: {
      type: Object,
      required: true
    },
    passengers: {
      type: Object
    },
    emergency: {
      type: Object
    },
    statusPnr: {
      type: String
    },
    idPnr: {
      type: String
    },
    errorPnr: {
      type: Object
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

validateFlightSchema.post('save', () => {
  console.log('INSERCION EN validateFlight')
})

validateFlightSchema.pre('findOneAndRemove', async () => {
  console.log('DELETE EN validateFlight')
})

validateFlightSchema.post('findOneAndUpdate', async () => {
  console.log('ACTUALIZACION EN validateFlight')
})

validateFlightSchema.plugin(mongoosePaginate)
validateFlightSchema.plugin(mongoose_delete, { overrideMethods: true })

module.exports = mongoose.model('validateflight', validateFlightSchema)
