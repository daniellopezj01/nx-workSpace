const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')

const questionsReservation = new mongoose.Schema(
  {
    title: {
      type: String,
      default: ''
    },
    question: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      required: true,
      enum: ['public', 'draft'],
      default: 'public'
    },
    specialKey: {
      type: String
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

questionsReservation.post('save', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('INSERT QUESTIONS')
  }
})

questionsReservation.pre('findOneAndRemove', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('DELETE QUESTIONS')
  }
})

questionsReservation.post('findOneAndUpdate', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('UPDATE QUESTIONS')
  }
})

questionsReservation.plugin(mongoosePaginate)
questionsReservation.plugin(mongoose_delete, { overrideMethods: true })

module.exports = mongoose.model('questionsreservation', questionsReservation)
