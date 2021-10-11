const { serviceWriteResizeImages } = require('./serviceWriteResizeImages')
const { serviceLoadImageS3 } = require('./serviceLoadImageS3')
const { serviceWriteFile } = require('./serviceWriteFile')
const { serviceDownloadImage } = require('./serviceDownloadImage')

module.exports = {
  serviceWriteResizeImages,
  serviceLoadImageS3,
  serviceWriteFile,
  serviceDownloadImage
}
