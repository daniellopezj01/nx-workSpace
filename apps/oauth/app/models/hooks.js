const mongoose = require('mongoose')

const HooksSchema = new mongoose.Schema(
  {
    target_url: {
      type: String,
      required: true
    },
    user_id: {
      type: String
    },
    bundle: {
      type: Object
    },
    action_trigger: {
      type: String
    },
    extra: {
      type: Object
    },
    client_id: {
      type: String
    },
    client_token: {
      type: String
    },
    event: {
      type: String
    },
    action_id: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

module.exports = mongoose.model('hooks', HooksSchema)
