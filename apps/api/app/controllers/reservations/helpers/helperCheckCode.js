const mongoose = require('mongoose')

const helperCheckCode = (q) => new Promise((resolve) => {
  if (mongoose.Types.ObjectId.isValid(q)) {
    resolve({ _id: mongoose.Types.ObjectId(q) })
  } else {
    resolve({ code: q })
  }
})

module.exports = { helperCheckCode }
