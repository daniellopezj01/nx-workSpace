const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')
const nano = require('nanoid/non-secure')

const PaymentMethodsSchema = new mongoose.Schema(
  {
    codePayment: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => nano.customAlphabet('PM1234567890', 8)()
    },
    idPayment: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    privateKeyProd: {
      type: String,
      select: false,
      required: true
    },
    publicKeyProd: {
      // id
      type: String,
      required: true
    },
    keyFrontProd: {
      type: String
    },
    privateKeyTest: {
      type: String,
      select: false,
      required: true
    },
    publicKeyTest: {
      // id
      type: String,
      required: true
    },
    default: {
      type: Boolean,
      default: false
    },
    customData: {
      // objeto del stripe
      type: Object
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

PaymentMethodsSchema.post('save', () => {
  console.log('INSERCION EN paymentMethods')
})

PaymentMethodsSchema.pre('findOneAndRemove', async () => {
  console.log('DELETE EN paymentMethods')
})

PaymentMethodsSchema.post('findOneAndUpdate', async () => {
  console.log('ACTUALIZACION EN paymentMethods')
})

PaymentMethodsSchema.plugin(mongoose_delete, { overrideMethods: true })
PaymentMethodsSchema.plugin(aggregatePaginate)
PaymentMethodsSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('paymentmethods', PaymentMethodsSchema)
