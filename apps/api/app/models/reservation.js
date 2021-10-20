const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const nano = require('nanoid/non-secure')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
const uniqueValidator = require('mongoose-unique-validator')

const ReservationSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => nano.customAlphabet('AB1234567890', 8)()
    },
    travelerFirstName: {
      type: String,
      required: true
    },
    travelerLastName: {
      type: String,
      required: true
    },
    travelerEmail: {
      type: String,
      required: true
    },
    travelerPhone: {
      type: Object,
      required: true
    },

    travelerDocument: {
      // 1
      type: String,
      required: true
    },
    travelerAddress: {
      // 2
      type: String,
      required: true
    },
    travelerBirthDay: {
      // 2
      type: Date,
      required: true
    },
    travelerGender: {
      // 2
      type: String,
      enum: ['M', 'F', 'O']
    },
    country: {
      // 2
      type: String
    },
    city: {
      type: String
    },
    percentage: {
      type: Number,
      required: true,
      default: 0
    },
    idIntention: {
      type: mongoose.Schema.Types.ObjectId
      // required: true
    },
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    idDeparture: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    idTour: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    signature: {
      type: Object
    },
    status: {
      type: String,
      required: true,
      enum: ['completed', 'progress', 'cancelled', 'pending'],
      default: 'pending'
    },
    observations: {
      type: String
    },
    amount: {
      type: Number,
      required: true
    },
    buyerFirstName: {
      type: String
    },
    buyerDocument: {
      type: String
    },
    buyerLastName: {
      type: String
    },
    buyerEmail: {
      // 3
      type: String
    },
    buyerPhone: {
      type: Object
    },
    buyerBirthDay: {
      type: Date
    },
    imagePassPort: {
      type: Object
    },
    emergencyName: {
      type: String
    },
    emergencyLastName: {
      type: String
    },
    emergencyPhone: {
      type: Object
    },
    emergencyPhoneOptional: {
      type: Object
    },
    emergencyRelationship: {
      type: String
    },
    medicalAllergies: {
      type: String
    },
    existingDiseases: {
      type: String
    },
    bloodType: {
      type: String
    },
    invoice: {
      type: String
    },
    sellingAgent: {
      type: mongoose.Schema.Types.ObjectId
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

ReservationSchema.post('save', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('INSERT RESERVATIONS')
  }
})

ReservationSchema.pre('findOneAndRemove', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('DELETE RESERVATIONS')
  }
})

ReservationSchema.post('findOneAndUpdate', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('UPDATE RESERVATIONS')
  }
})

ReservationSchema.plugin(mongoosePaginate)
ReservationSchema.plugin(aggregatePaginate)
ReservationSchema.plugin(mongoose_delete, { overrideMethods: true })
ReservationSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Reservation', ReservationSchema)
