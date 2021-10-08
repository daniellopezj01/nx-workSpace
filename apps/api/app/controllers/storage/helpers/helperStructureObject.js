const mime = require('mime')

const helperStructureObject = (data) => new Promise(async (resolve) => {
  const send = await Promise.all(
    Object.values(data).map(async (a) => {
      const object = {}
      object.source = {
        original: a.originalPath
      }
      if (mime.getType(a.fileName).includes('image')) {
        object.type = 'image'
        object.source = {
          original: a.originalPath,
          small: a.smallPath,
          sm: a.smPath,
          medium: a.mediumPath,
          large: a.largePath
        }
      } else if (mime.getType(a.fileName).includes('video')) {
        object.type = 'video'
      } else {
        object.type = 'file'
      }
      object.fileName = a.fileName
      object._id = a._id
      return object
    })
  )
  resolve(send)
})

module.exports = { helperStructureObject }
