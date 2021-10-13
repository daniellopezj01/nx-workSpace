const mongoose = require('mongoose')

const ContrasSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Promo para todo el mundo
      required: true
    },
    discount: {
      type: String,
      enum: ['percentage', 'amount'], // amount
      required: true
    },
    amount: {
      type: Number,
      required: true // 5
    },
    startAt: {
      type: Date,
      default: null
    },
    endAt: {
      type: Date,
      default: null
    },
    typeContract: {
      type: String,
      enum: ['all', 'user'], // all
      required: true,
      default: 'all'
    },
    intent: {
      type: String,
      enum: ['buyTour', 'buyProduct', 'insertWallet'], // buyTour
      required: true
    },
    sources: {
      // ID app machine
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['enabled', 'disabled'], //
      default: 'enabled'
    },
    allowToAccumulate: {
      type: Boolean,
      required: false //
    },
    tags: {
      type: Array,
      default: [] // Rpomo 2022 2023
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

module.exports = mongoose.model('contracts', ContrasSchema)
