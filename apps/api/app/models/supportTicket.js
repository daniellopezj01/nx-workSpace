const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const nano = require('nanoid/non-secure')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const messagesSchema = new mongoose.Schema(
  {
    message: {
      type: String
    },
    creator: {
      type: Object
    },
    dateCreate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

const supportTicketSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      default: () => nano.customAlphabet('ST1234567890', 10)()
    },
    status: {
      type: String,
      required: true,
      lowercase: true,
      enum: ['enabled', 'disabled', 'await', 'progress', 'closed'],
      default: 'progress'
    },
    userShouldSend: {
      type: Boolean,
      required: true,
      default: false
    },
    codeReservation: {
      type: String,
      required: true
    },
    messages: {
      type: [messagesSchema],
      default: []
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

supportTicketSchema.post('save', () => {
  console.log('INSERCION EN ticket')
})

supportTicketSchema.pre('findOneAndRemove', async () => {
  console.log('DELETE EN ticket')
})

supportTicketSchema.post('findOneAndUpdate', async () => {
  console.log('ACTUALIZACION EN ticket')
})

supportTicketSchema.plugin(aggregatePaginate)
supportTicketSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('supportticket', supportTicketSchema)
