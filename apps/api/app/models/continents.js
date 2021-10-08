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
  console.log('INSERCION EN continents')
})

continentsSchema.pre('findOneAndRemove', async () => {
  console.log('DELETE EN continents')
})

continentsSchema.post('findOneAndUpdate', async () => {
  console.log('ACTUALIZACION EN continents')
})

continentsSchema.plugin(mongoose_delete, { overrideMethods: true })
continentsSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('continents', continentsSchema)
