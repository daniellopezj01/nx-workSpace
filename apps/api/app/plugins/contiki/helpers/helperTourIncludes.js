const _ = require('lodash')

const addItems = (array, isFeatured) =>
  new Promise((resolve) => {
    const included = []
    for (let i = 0; i < array.length; i++) {
      const { title, items } = array[i]
      included.push({
        title,
        description: _.head(items),
        isFeatured
      })
    }
    resolve(included)
  })

const helperTourIncludes = (data) =>
  new Promise(async (resolve) => {
    const { highlights, whatsIncluded } = data
    const included = _.concat(
      await addItems(highlights, true),
      await addItems(whatsIncluded, false)
    )
    resolve(included)
  })

module.exports = { helperTourIncludes }
