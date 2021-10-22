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
  if (process.env.NODE_ENV !== 'test') {
    console.log('INSERT TAGS')
  }
})

tagsSchema.pre('findOneAndRemove', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('REMOVE TAGS')
  }
})

tagsSchema.post('findOneAndUpdate', async () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('UPDATE TAGS')
  }
})

tagsSchema.plugin(mongoosePaginate)
tagsSchema.plugin(mongoose_delete, { overrideMethods: true })

module.exports = mongoose.model('tags', tagsSchema)
