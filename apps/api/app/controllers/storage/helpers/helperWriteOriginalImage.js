const fs = require('fs')

// writeOriginImage
const helperWriteOriginalImage = (file, pathFile) => new Promise((resolve) => {
  fs.writeFile(pathFile, file.data, (err) => {
    if (err) {
      resolve(false)
    } else {
      resolve(true)
    }
  })
})

module.exports = { helperWriteOriginalImage }
