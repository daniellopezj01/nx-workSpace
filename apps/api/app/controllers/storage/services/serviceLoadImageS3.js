/* eslint-disable max-statements */
const { helperUploadMedia } = require('../helpers/helperUploadMedia')

const serviceLoadImageS3 = (file, loadAll = true) => new Promise(async (resolve) => {
  file.image = 'image'
  if (loadAll === true) {
    file.smallPath = await helperUploadMedia(file.smallPath)
    file.smPath = await helperUploadMedia(file.smPath)
    file.mediumPath = await helperUploadMedia(file.mediumPath)
    file.largePath = await helperUploadMedia(file.largePath)
  } else if (Array.isArray(loadAll)) {
    if (loadAll.includes('smallPath')) {
      file.smallPath = await helperUploadMedia(file.smallPath)
    }
    if (loadAll.includes('smPath')) {
      file.smPath = await helperUploadMedia(file.smPath)
    }
    if (loadAll.includes('mediumPath')) {
      file.mediumPath = await helperUploadMedia(file.mediumPath)
    }
    if (loadAll.includes('largePath')) {
      file.largePath = await helperUploadMedia(file.largePath)
    }
  }
  file.originalPath = await helperUploadMedia(file.originalPath)
  resolve(file)
})

module.exports = { serviceLoadImageS3 }
