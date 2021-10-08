const fs = require('fs')
const utils = require('../../../../middleware/utils')

const serviceSaveTokenSabre = (data) => new Promise((resolve, reject) => {
  try {
    const dataFile = JSON.stringify(data)
    const dir = './public/tmp'
    const name = `${dir}/sabre.json`
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    fs.writeFile(name, dataFile, (err) => {
      if (err) {
        console.log('serviceSaveTokenSabre', err.message)
        resolve(false)
      } else {
        resolve(true)
      }
    })
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'SAVE_TOKEN_SABRE')
  }
})

module.exports = { serviceSaveTokenSabre }
