const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')
const nano = require('nanoid/non-secure')

const PayOrderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['await', 'succeeded', 'failure', 'cancel', 'hold'],
      default: 'await'
    },
    code: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => nano.customAlphabet('PQ1234567890', 8)()
    },
    idOperation: {
      // id de stripe
      type: String,
      required: true
    },
    externalCode: {
      // codigo que se utiliza para guardar pagos diferentes a las reservaciones y monedero
      type: String
    },
    operationType: {
      // tipo de las posibles operaciones externas
      type: String,
      enum: ['flights']
    },
    amount: {
      // reservacion
      type: Number,
      required: true
    },
    currency: {
      // env
      type: String,
      default: 'USD'
      // required: true
    },
    idUser: {
      // token
      type: mongoose.Types.ObjectId,
      required: true
    },
    idReservation: {
      // id
      type: mongoose.Types.ObjectId
    },
    attached: {
      type: String
    },
    platform: {
      // stripe
      type: String,
      enum: ['stripe', 'cash', 'discount', 'Transferencia Bancaria', 'paypal'],
      required: true,
      default: 'stripe'
    },
    description: {
      type: String
    },
    authenticated: {
      type: Object
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

PayOrderSchema.post('save', () => {
  console.log('INSERCION EN PayOrders')
})

PayOrderSchema.pre('findOneAndRemove', async () => {
  console.log('DELETE EN PayOrders')
})

PayOrderSchema.post('findOneAndUpdate', async () => {
  console.log('ACTUALIZACION EN PayOrders')
})

PayOrderSchema.plugin(mongoose_delete, { overrideMethods: true })
PayOrderSchema.plugin(aggregatePaginate)
PayOrderSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('PayOrder', PayOrderSchema)
