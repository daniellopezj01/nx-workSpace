/* eslint-disable handle-callback-err */
const _ = require('lodash')
const mongoose = require('mongoose')
const model = require('../../../models/user')
const db = require('../../../middleware/db')

const helperGetDetailByUser = async (id) => {
  return new Promise((resolve) => {
    const data = db.getLookReferred(model, { _id: mongoose.Types.ObjectId(id) })
    data.exec((err, item) => {
      const usr = _.head(item)
      resolve(usr ? usr.ref : null)
    })
  })
}

module.exports = { helperGetDetailByUser }
