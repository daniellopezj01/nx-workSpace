/* eslint-disable no-unused-vars */
const fs = require('fs')
const request = require('request')
const nanoid = require('nanoid')
const { serviceWriteResizeImages } = require('./serviceWriteResizeImages')
const { serviceLoadImageS3 } = require('./serviceLoadImageS3')

const serviceDownloadImage = (url, loadAll = true) => new Promise(async (resolve, reject) => {
  try {
    const path = `./public/media/tmp_${nanoid.nanoid()}_image.png`
    request.head(url, (err, res, body) => {
      url = decodeURIComponent(url)
      request(url)
        .pipe(fs.createWriteStream(path))
        .on('response', (response) => {
          if (!response.headers['content-type'].match(/image/)) {
            reject('NOT IMAGE')
          }
        })
        .on('error', (error) => {
          reject(error)
        })
        .on('close', () => {
          fs.readFile(`${process.cwd()}/${path}`, (_errorFile, data) => {
            if (_errorFile) {
              reject('_errorFile', _errorFile)
            }
            serviceWriteResizeImages(data, true)
              .then(async (file) => {
                const s3 = await serviceLoadImageS3(file, loadAll)
                  .catch(() => reject('error in load file'))
                resolve(s3)
              })
              .catch(() => reject('error in load file'))
          })
        })
    })
  } catch (error) {
    reject('serviceDownloadImage', error.message)
  }
})

module.exports = { serviceDownloadImage }
