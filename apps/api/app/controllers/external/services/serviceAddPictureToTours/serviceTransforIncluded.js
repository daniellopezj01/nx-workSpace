/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const { serviceDownloadImage } = require('../../../storage/services')

const serviceTransforIncluded = (included = []) => new Promise(async (resolve) => {
  const newAttached = []
  for (let i = 0; i < included.length; i++) {
    let element = included[i]
    let { image } = element
    if (image) {
      const { source } = image
      const sizeToLoad = ['smPath']
      await serviceDownloadImage(source?.original, sizeToLoad)
        .then((object) => {
          const newSource = {
            ...source,
            ..._.pick(object, sizeToLoad)
          }
          newSource.sm = newSource.smPath
          delete newSource.smPath
          image = {
            ...image, source: newSource
          }
          element = { ...element._doc, image }
        }).catch(() => {
          console.log('fallo el item', element._id)
        })
    }
    newAttached.push(element)
  }
  resolve(newAttached)
})

module.exports = { serviceTransforIncluded }
