const mongoose = require('mongoose')
const { ObjectId } = require('mongoose').Types

const helperCheckKey = (q) => new Promise((resolve) => {
  if (mongoose.Types.ObjectId.isValid(q)) {
    if (`${new ObjectId(q)}` === `${q}`) {
      resolve({ _id: mongoose.Types.ObjectId(q) })
    } else {
      resolve({ slug: q })
    }
  } else {
    resolve({ slug: q })
  }
})

module.exports = { helperCheckKey }
