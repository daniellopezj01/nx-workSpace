const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: Object,
      required: true
    },
    description: {
      type: String
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    color: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

categorySchema.post('save', () => {
  console.log('INSERCION EN categories')
})

categorySchema.pre('findOneAndRemove', async () => {
  console.log('DELETE EN categories')
})

categorySchema.post('findOneAndUpdate', async () => {
  console.log('ACTUALIZACION EN categories')
})

categorySchema.plugin(mongoosePaginate)
categorySchema.plugin(mongoose_delete, { overrideMethods: true })

module.exports = mongoose.model('category', categorySchema)
