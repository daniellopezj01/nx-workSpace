const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')

const continentsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

continentsSchema.post('save', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('INSERCION EN continents')
  }
})

continentsSchema.pre('findOneAndRemove', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('DELETE EN continents')
  }
})


continentsSchema.post('findOneAndUpdate', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('ACTUALIZACION EN continents')
  }
})

continentsSchema.plugin(mongoose_delete, { overrideMethods: true })
continentsSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('continents', continentsSchema)
