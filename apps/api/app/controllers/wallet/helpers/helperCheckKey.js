const mongoose = require('mongoose')

const helperCheckKey = (q) =>
  new Promise((resolve) => {
    if (mongoose.Types.ObjectId.isValid(q)) {
      resolve({ idReservation: mongoose.Types.ObjectId(q) })
    } else {
      resolve({ code: q })
    }
  })

module.exports = { helperCheckKey }
