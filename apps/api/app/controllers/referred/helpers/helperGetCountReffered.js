/* eslint-disable handle-callback-err */
const _ = require('lodash')
const mongoose = require('mongoose')
const model = require('../../../models/user')
const db = require('../../../middleware/db')

const helperGetCountReffered = async (id) => {
  return new Promise((resolve) => {
    const data = db.getLookReferredCount(model, {
      _id: mongoose.Types.ObjectId(id)
    })
    data.exec((err, item) => {
      resolve(_.head(item))
    })
  })
}

module.exports = { helperGetCountReffered }
