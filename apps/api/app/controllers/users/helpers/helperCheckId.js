const mongoose = require('mongoose')

const helperCheckId = (q) => new Promise((resolve) => {
  resolve({ idUser: mongoose.Types.ObjectId(q) })
})

module.exports = { helperCheckId }
