const path = require('path')
const slugify = require('slugify')
const cryptoRandomString = require('crypto-random-string')
const { helperUploadMedia } = require('../helpers')

const router = '/apps/api/src/assets/public/media/'

const serviceWriteFile = (file = {}) => new Promise(async (resolve) => {
  const ext = path.extname(file.name)
  const fileName = `${cryptoRandomString({ length: 3 })}-${slugify(
    file.name
  )}`
  const absolute = `${process.cwd()}${router}${fileName}`
  await file.mv(absolute)
  resolve({
    fileName,
    ext,
    fileType: ext,
    originalPath: await helperUploadMedia(fileName)
  })
})

module.exports = { serviceWriteFile }
