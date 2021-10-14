/* eslint-disable max-statements */
const { v4: uuidv4 } = require('uuid')
const utils = require('../../../middleware/utils')

const { helperCompressImage, helperWriteOriginalImage } = require('../helpers')

const router = '/public/media/'

// saveImage
const serviceWriteResizeImages = (file, buffer = false) => new Promise(async (resolve, reject) => {
  try {
    const filesWebp = {}
    filesWebp.fileName = `${uuidv4()}.png`
    filesWebp.fileType = '.png'
    const pathOriginal = `.${router}${filesWebp.fileName}`
    const successWrite = !buffer
      ? await helperWriteOriginalImage(file, pathOriginal)
      : null
    if (successWrite || buffer) {
      const bufferOrPath = !buffer ? pathOriginal : file
      filesWebp.originalPath = await helperCompressImage(bufferOrPath, `original_${filesWebp.fileName}`)
        .catch(() => { throw new Error('error in load file') })
      filesWebp.smallPath = await helperCompressImage(bufferOrPath, `small_${filesWebp.fileName}`, 200)
        .catch(() => { throw new Error('error in load file') })
      filesWebp.smPath = await helperCompressImage(bufferOrPath, `sm_${filesWebp.fileName}`, 360)
        .catch(() => { throw new Error('error in load file') })
      filesWebp.mediumPath = await helperCompressImage(bufferOrPath, `medium_${filesWebp.fileName}`, 600)
        .catch(() => { throw new Error('error in load file') })
      filesWebp.largePath = await helperCompressImage(bufferOrPath, `large_${filesWebp.fileName}`, 1000)
        .catch(() => { throw new Error('error in load file') })
      await utils.deleteFile(pathOriginal)
      resolve(filesWebp)
    }
  } catch (error) {
    console.log('serviceWriteResizeImages', error.message)
    reject(error)
  }
})

module.exports = { serviceWriteResizeImages }
