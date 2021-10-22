/* eslint-disable @typescript-eslint/no-empty-function */
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
  if (process.env.NODE_ENV !== 'test') {
    console.log('INSERT IN categories')
  }
})

categorySchema.pre('findOneAndRemove', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('DELETE IN categories')
  }
})

categorySchema.post('findOneAndUpdate', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('UPDATE IN categories')
  }
})

categorySchema.plugin(mongoosePaginate)
categorySchema.plugin(mongoose_delete, { overrideMethods: true })

module.exports = mongoose.model('category', categorySchema)
