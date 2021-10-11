/* eslint-disable camelcase */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
const mongoose_delete = require('mongoose-delete')

const countries = new mongoose.Schema(
  {

    name_en: {
      type: String,
      required: true
    },
    name_es: {
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

countries.plugin(aggregatePaginate)
countries.plugin(mongoosePaginate)
countries.plugin(mongoose_delete, { overrideMethods: true })

module.exports = mongoose.model('countries', countries)
