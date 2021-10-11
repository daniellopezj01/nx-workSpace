/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const { serviceDownloadImage } = require('../../../storage/services')

const serviceTransforAttached = (attached = []) => new Promise(async (resolve, reject) => {
  try {
    const newAttached = []
    for (let i = 0; i < attached.length; i++) {
      let element = attached[i]
      const { source } = element
      const sizeToLoad = ['smPath']
      await serviceDownloadImage(source.original, sizeToLoad).then((object) => {
        const newSource = {
          ...source,
          ..._.pick(object, sizeToLoad)
        }
        newSource.sm = newSource.smPath
        delete newSource.smPath
        element = { ...element, source: newSource }
      }).catch(() => {
        console.log('fallo el item', element._id)
      })
      newAttached.push(element)
    }
    resolve(newAttached)
  } catch (error) {
    reject(error)
  }
})

module.exports = { serviceTransforAttached }
