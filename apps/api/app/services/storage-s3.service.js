const fs = require('fs')
const mime = require('mime')
const aws = require('../helpers/aws')

const AWS_BUCKET_STORAGE = process.env.AWS_BUCKET_STORAGE || 'task_app_storage'
const s3 = new aws.S3({
  params: {
    Bucket: AWS_BUCKET_STORAGE
  }
})

// const createBucket = () => {
//   const bucketParams = {
//     Bucket: BUCKET_STORAGE
//   }

//   s3.createBucket(bucketParams, (err, data) => {
//     if (err) {
//       console.log('Error', err)
//     } else {
//       console.log('Success', data.Location)
//     }
//   })
// }

const checkBucket = async () =>
  new Promise(async (resolve, reject) => {
    const options = {
      Bucket: AWS_BUCKET_STORAGE
    }
    s3.headBucket(options, (err) => {
      if (!err) {
        resolve(true)
      } else {
        reject(false)
      }
    })
  })

const insideUpload = async (pathfile = null, name = '') =>
  new Promise(async (resolve, reject) => {
    try {
      checkBucket()
        .then(() => {
          const body = fs.createReadStream(`${pathfile}`)
          // console.log('--------------------------->',)
          const params = {
            Bucket: AWS_BUCKET_STORAGE,
            Body: body,
            Key: `${name}`,
            ContentType: mime.getType(pathfile),
            CacheControl: 'public, max-age=31536000',
            ACL: 'public-read'
          }
          s3.upload(params, (err, data) => {
            if (!err) {
              const returnS3 = {}
              returnS3.urlStorage = data.Location
              resolve(returnS3)
            } else {
              reject(err)
            }
          })
        })
        .catch((err) => reject(err))
    } catch (e) {
      reject(e)
    }
  })

// const downloadFile = (key, filePathToWrite) => {
//   return new Promise(async (resolve, reject) => {
//     const params = {
//       Bucket: BUCKET_STORAGE,
//       Key: key
//     }
//     await s3.getObject(params, async (err, data) => {
//       if (err) {
//         console.error(err)
//         reject(err)
//       }

//       if (filePathToWrite) {
//         fs.writeFileSync(filePathToWrite, data.Body.toString())
//         console.log(`${filePathToWrite} has been created!`)
//         resolve(data)
//       }
//       // return data
//     })
//   })
// }

// eslint-disable-next-line consistent-return
// const deleteFile = key => {
//   try {
//     const params = {
//       Bucket: BUCKET_STORAGE,
//       Key: key
//     }
//     s3.deleteObject(params, (err, data) => {
//       if (!err) {
//         return true
//       }
//     })
//   } catch (e) {
//     return false
//   }
// }

const StorageS3 = {
  uploadMedia(pathfile, name) {
    return insideUpload(pathfile, name)
  },

  uploadBackUp(pathfile, name) {
    return insideUpload(pathfile, name)
  }
}

exports.StorageS3 = StorageS3
