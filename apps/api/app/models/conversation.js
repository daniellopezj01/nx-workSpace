/* eslint-disable camelcase */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const mongoose_delete = require('mongoose-delete')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const messagesSchema = new mongoose.Schema({
  message: {
    type: Object
  },
  creator: {
    type: String
  },
  dateCreate: {
    type: Date
  }
})

const conversationSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true
    },
    members: {
      type: Array,
      required: true
    },
    title: {
      type: String
    },
    type: {
      type: String,
      enum: ['single', 'group'],
      default: 'single'
    },
    tour: {
      type: Object
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

conversationSchema.post('save', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('INSERT CONVERSATIONS')
  }
})

conversationSchema.pre('findOneAndRemove', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('DELETE CONVERSATIONS')
  }
})

conversationSchema.post('findOneAndUpdate', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('UPDATE CONVERSATIONS')
  }
})

conversationSchema.plugin(aggregatePaginate)
conversationSchema.plugin(mongoose_delete, { overrideMethods: true })
conversationSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('conversation', conversationSchema)
