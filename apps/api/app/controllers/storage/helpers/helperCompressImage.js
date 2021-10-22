const sharp = require('sharp')
const compressImages = require('compress-images')
const utils = require('../../../middleware/utils')

const router = `${process.cwd()}/apps/api/public/media/`
const routerCompress = `${process.cwd()}/apps/api/public/media_compress/`

const helperCompressImage = (pathInPut, name = '', size = null) => new Promise((resolve, reject) => {
  try {
    const relativePath = `${name}`
    const pathOutPut = `${router}${relativePath}`
    sharp(pathInPut)
      .png({ quality: 50 })
      .resize(size, size)
      .toFile(pathOutPut, () => {
        if (process.env.COMPRESS_IMAGE === 'true') {
          compressImages(pathOutPut, routerCompress,
            { compress_force: false, statistic: false, autoupdate: true }, false,
            { jpg: { engine: 'mozjpeg', command: ['-quality', '50'] } },
            { png: { engine: 'pngquant', command: ['--quality=20-40', '-o'] } },
            { svg: { engine: 'svgo', command: '--multipass' } },
            {
              gif: { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web'] }
            },
            async (compressError) => {
              if (compressError) {
                reject(compressError)
              }
              await utils.deleteFile(pathOutPut).catch((err) => { console.log('deleteFile', err) })
              const relativePathCompress = `${routerCompress}${relativePath}`
              await utils.copyAndPaste(relativePathCompress, pathOutPut).catch((err) => { console.log(err.message) })
              resolve(relativePath)
            })
        } else {
          resolve(relativePath)
        }
      })
  } catch (e) {
    console.log(e)
    reject(e)
  }
})

module.exports = { helperCompressImage }
