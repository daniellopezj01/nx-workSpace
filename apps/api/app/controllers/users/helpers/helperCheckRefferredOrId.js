const mongoose = require('mongoose')

const helperCheckRefferredOrId = (q) => new Promise((resolve) => {
  if (mongoose.Types.ObjectId.isValid(q)) {
    resolve({ _id: mongoose.Types.ObjectId(q) })
  } else {
    resolve({ referredCode: q })
  }
})

module.exports = { helperCheckRefferredOrId }
