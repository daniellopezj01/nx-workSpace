const request = require('request')
const fs = require('fs')

const {
  serviceLoadImageS3,
  serviceWriteResizeImages
} = require('../../storage/services')
const User = require('../../../models/user')

/** Save Avatar */

const saveAavatar = (user, avatar) => {
  User.findOneAndUpdate({ _id: user._id }, { avatar }, (err, item) => {
    console.log(err.message)
    console.log(item)
  })
}

const helperDownload = (url, path, user, callback) => {
  request.head(url, () => {
    url = decodeURIComponent(url)
    request(url)
      .pipe(fs.createWriteStream(path))
      .on('response', (res) => {
        if (!res.headers['content-type'].match(/image/)) {
          console.log('NOT IMAGE')
          callback(new Error('Not an image.'))
        }
      })
      .on('error', (err) => {
        callback(err)
      })
      .on('close', () => {
        fs.readFile(`${process.cwd()}/${path}`, (err, data) => {
          serviceWriteResizeImages(data, true).then(async (e) => {
            const s3 = await serviceLoadImageS3(e)
            saveAavatar(user, s3.mediumPath)
          })
        })
      })
  })
}

module.exports = { helperDownload }
