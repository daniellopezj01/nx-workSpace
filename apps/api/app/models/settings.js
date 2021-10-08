const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const SettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    currencies: {
      type: Array,
      // required: true,
      default: [
        {
          name: 'USD',
          value: 1,
          country: 'US'
        }
      ]
    },
    payAmount: {
      type: Array,
      // required: true,
      default: [100, 30, 15]
    },
    instaFeed: {
      type: String
    },
    value: {
      type: Object
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
SettingsSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Settings', SettingsSchema)
