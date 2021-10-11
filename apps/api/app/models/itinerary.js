const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')

const ActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isNight: {
    type: Boolean,
    required: true,
    default: false
  }
})

const itinerarySchema = new mongoose.Schema(
  {
    itineraryName: {
      type: String,
      required: true
    },
    itineraryDescription: {
      type: String
      // required: true
    },
    idTour: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    stringLocation: {
      country: {
        type: String
        // required: true
      },
      countryCode: {
        type: String
        // required: true
      },
      city: {
        type: String
        // required: true
      },
      coordinates: {
        type: Array
        // required: true
      },
      neighborhood: {
        type: String
        // required: true
      }
    },
    details: {
      type: [ActivitySchema],
      default: []
    },
    itineraryAttached: {
      type: [Object]
    },
    includedInMap: {
      type: Boolean,
      default: false
    },
    idTourExternal: {
      type: Number
      // required: true
    },
    idOptionTour: {
      type: Number
      // required: true
    },
    sort: {
      type: Number,
      default: 0
    },
    customData: {
      type: Array
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

itinerarySchema.post('save', () => {
  // console.log('INSERCION EN itinerarys')
})

itinerarySchema.pre('findOneAndRemove', async () => {
  console.log('DELETE EN itinerarys')
})

itinerarySchema.post('findOneAndUpdate', async () => {
  // console.log('ACTUALIZACION EN itinerarys')
})

itinerarySchema.plugin(mongoosePaginate)
itinerarySchema.plugin(mongoose_delete, { overrideMethods: true })
module.exports = mongoose.model('itinerary', itinerarySchema)
