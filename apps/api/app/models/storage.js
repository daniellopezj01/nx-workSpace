const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
// eslint-disable-next-line camelcase
const mongoose_delete = require('mongoose-delete')

const StorageSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    fileName: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    originalPath: {
      type: String,
      required: true
    },
    smallPath: {
      type: String
    },
    smPath: {
      type: String
    },
    mediumPath: {
      type: String
    },
    largePath: {
      type: String
    },
    mimetype: {
      type: String
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

StorageSchema.post('save', () => {
  // console.log('INSERCION EN storage')
})

StorageSchema.pre('findOneAndRemove', async () => {
  // console.log('DELETE EN storage')
})

StorageSchema.post('findOneAndUpdate', async () => {
  // console.log('ACTUALIZACION EN Storages')
})
StorageSchema.plugin(mongoose_delete, { overrideMethods: true })
StorageSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('storage', StorageSchema)
