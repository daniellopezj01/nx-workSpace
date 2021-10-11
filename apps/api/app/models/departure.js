const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')

const ContractScheme = new mongoose.Schema({
  percentageAmount: {
    type: Number, // 100, 15 , 30
    required: true
  },
  discount: {
    type: String,
    enum: ['percentage', 'amount', 'none'], // amount
    required: true
  },
  amountDiscount: {
    type: Number,
    required: false
  },
  startAt: {
    type: Date,
    default: null
  },
  endAt: {
    type: Date,
    default: null
  },
  specialPayment: {
    type: Boolean,
    default: false
  },
  intent: {
    type: String,
    enum: ['buyTour', 'buyProduct', 'insertWallet'], // buyTour
    default: 'buyTour',
    required: true
  },
  allowToAccumulate: {
    type: Boolean,
    required: false //
  }
})

const departureSchema = new mongoose.Schema(
  {
    startDateDeparture: {
      type: String,
      required: true
    },
    endDateDeparture: {
      type: String,
      required: true
    },
    stock: {
      // people in the departure
      type: Number,
      // required: true,
      default: 0
    },
    minStock: {
      type: Number
      // required: true
    },
    minAge: {
      type: Number,
      default: 18
    },
    maxAge: {
      type: Number
    },
    normalPrice: {
      type: Number,
      required: true
    },
    specialPrice: {
      type: Number
    },
    payAmount: {
      type: [ContractScheme],
      required: true
    },
    description: {
      type: String
    },
    closeDateDeparture: {
      type: String
      // required: true
    },
    status: {
      type: String,
      enum: ['visible', 'not_visible', 'close'],
      required: true,
      default: 'visible'
    },
    currencies: {
      type: [Object]
    },
    flight: {
      type: Boolean,
      required: true,
      default: false
    },
    idTour: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    infoToReservation: {
      type: Object
    },
    roomType: {
      type: String
    },
    idTourExternal: {
      // required: true
      type: Number
    },
    idOptionTour: {
      type: Number
      // required: true
    },
    idExternal: {
      type: String
    },
    customData: {
      type: {}
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

departureSchema.post('save', () => {
  // console.log('INSERCION EN departures')
})

departureSchema.pre('findOneAndRemove', async () => {
  console.log('DELETE EN departures')
})

departureSchema.post('findOneAndUpdate', async () => {
  // console.log('ACTUALIZACION EN departures')
})

// departureSchema.plugin(mongoosePaginate)

departureSchema.plugin(mongoose_delete, { overrideMethods: true })
departureSchema.plugin(aggregatePaginate)
module.exports = mongoose.model('departure', departureSchema)
