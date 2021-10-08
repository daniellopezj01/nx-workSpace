const _ = require('lodash')

const structureImage = (images, name) => new Promise(async (resolve) => {
  images = _.filter(images, (i) => i.name === name)
  const small = _.minBy(images, 'width')
  const large = _.maxBy(images, 'width')
  let image = _.find(images, (i) => (i.width > small.width && i.width < small.width))
  if (!image) {
    image = large
  }
  resolve({
    fileName: name,
    source: {
      large: large.url,
      medium: image.url,
      original: image.url,
      small: small.url
    },
    type: 'image'
  })
})

const helperStructureImages = (data) => new Promise(async (resolve) => {
  const { images } = data
  const mainImage = await structureImage(images, 'primary_image')
  const mapImage = await structureImage(images, 'route_map')
  resolve([mainImage, mapImage])
})

module.exports = { helperStructureImages }
