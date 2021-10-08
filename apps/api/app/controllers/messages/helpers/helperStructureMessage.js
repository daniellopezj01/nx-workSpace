const moment = require('moment')

const helperStructureMessage = (message, idUser) => new Promise(async (resolve) => {
  resolve({
    message,
    creator: idUser,
    dateCreate: moment().toISOString()
  })
})

module.exports = { helperStructureMessage }
