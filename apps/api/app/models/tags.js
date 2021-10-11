const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')

const tagsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

tagsSchema.post('save', () => {
  console.log('INSERCION EN tags')
})

tagsSchema.pre('findOneAndRemove', async () => {
  console.log('DELETE EN tags')
})

tagsSchema.post('findOneAndUpdate', async () => {
  console.log('ACTUALIZACION EN tags')
})

tagsSchema.plugin(mongoosePaginate)
tagsSchema.plugin(mongoose_delete, { overrideMethods: true })

module.exports = mongoose.model('tags', tagsSchema)
