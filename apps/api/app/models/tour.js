const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')
// const mongoosastic = require('mongoosastic')
// const elastic = require('../services/elastic.service')

const ItemsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  image: {
    type: Object
  }
})

const CommentsSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    lowercase: true,
    enum: ['public', 'private'],
    default: 'public'
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  idReservation: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  vote: {
    type: Number
  },
  attachment: {
    type: Array
  },
  customData: {
    type: Array
  },
  dateCreate: {
    type: Date
  }
})

// const countriesSchema = new mongoose.Schema({
//   name_en: {
//     type: String,
//     required: true
//   },
//   name_es: {
//     type: String,
//     required: true
//   },
//   code: {
//     type: String,
//     required: true
//   }
// })

// const citiesSchema = new mongoose.Schema({
//   cityName: {
//     type: String,
//     required: true
//   },
//   countryName: {
//     type: String,
//     required: true
//   },
//   countryCode: {
//     type: String,
//     required: true
//   },
//   location: {
//     type: Object,
//     required: true
//   }
// })

const TourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    subTitle: {
      type: String
    },
    description: {
      type: String,
      required: true
    },
    idUser: {
      type: mongoose.Types.ObjectId
      // required: true
    },
    route: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      required: true,
      lowercase: true,
      enum: ['publish', 'draft', 'construction'],
      default: 'draft'
    },
    video: {
      type: String
    },
    category: {
      type: [mongoose.Types.ObjectId]
    },
    transport: {
      type: Array,
      default: []
    },
    attached: {
      type: Array
    },
    included: {
      type: [ItemsSchema],
      default: []
    },
    notIncluded: {
      type: [ItemsSchema],
      default: []
    },
    faq: {
      type: [ItemsSchema],
      default: []
    },
    comments: {
      type: [CommentsSchema],
      default: []
    },
    countries: {
      type: String
    },
    cities: {
      type: String
    },
    lenguages: {
      type: [Object],
      default: []
    },
    duration: {
      type: Number
    },
    likes: {
      type: Array,
      default: []
    },
    activityOptional: {
      type: Object
    },
    itinerary: {
      type: Object
    },
    featured: {
      type: String,
      enum: ['regular', 'offert', 'hot_Offert'],
      default: 'regular'
    },
    termsConditions: {
      type: String
    },
    type: {
      type: String,
      enum: ['departures', 'schedules'],
      default: 'departures'
    },
    continent: {
      required: true,
      // enum: ['AF', 'AN', 'EU', 'NA', 'SA'],
      type: Array
    },
    specialInfo: {
      type: String
    },
    tags: {
      type: [String],
      default: []
    },
    customData: {
      type: Object,
      default: {}
    },
    accountAgency: {
      type: String
    },
    paymentMethod: {
      type: String
      // required: true
    },
    idExternal: {
      type: Number
      // required: true
    },
    idOptionTour: {
      type: Number
      // required: true
    },
    addressStripe: {
      type: String
    },
    fromPlatform: {
      type: String
    },
    ownerUser: {
      type: mongoose.Types.ObjectId
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

TourSchema.post('save', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('INSERT TOURS')
  }
})

TourSchema.pre('findOneAndRemove', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('DELETE TOURS')
  }
})

TourSchema.post('findOneAndUpdate', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('UPDATE TOURS')
  }
})

TourSchema.plugin(aggregatePaginate)
TourSchema.plugin(mongoosePaginate)
TourSchema.plugin(mongoose_delete, { overrideMethods: true })
// TourSchema.plugin(mongoosastic, elastic.pack)
const model = mongoose.model('Tour', TourSchema)
// if (process.env.ELASTIC_STATUS === 'true') {
//   model.synchronize()
// }

module.exports = model
