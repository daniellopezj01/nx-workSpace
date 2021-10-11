const { StorageS3 } = require('../../../services/storage-s3.service')
const utils = require('../../../middleware/utils')

const router = '/public/media/'

const helperUploadMedia = (name) => new Promise(async (resolve) => {
  const cloudFront = process.env.AWS_CLOUDFRONT_STORAGE || null
  const absolute = `${process.cwd()}${router}${name}`
  const errorFile = `${process.env.API_URL}/media/${name}`
  if (process.env.NODE_ENV === 'production') {
    await StorageS3.uploadMedia(absolute, name)
      .then(async (res) => {
        await utils.deleteFile(absolute)
        let finallyUrl = res.urlStorage.split('://')
        finallyUrl = finallyUrl.slice(1).join('').split('/').splice(1)
        finallyUrl = `${cloudFront}/${finallyUrl.join('')}`
        finallyUrl = cloudFront ? finallyUrl : res.urlStorage
        resolve(finallyUrl)
      })
      .catch((e) => {
        console.log(e)
        resolve(errorFile)
        // Se almaceno en local y se asigna ruta del server
      })
  } else {
    resolve(errorFile)
  }
})

module.exports = { helperUploadMedia }
