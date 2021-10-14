const { translateSingle } = require('../index')
const { serviceStructureRequestTranslate } = require('../services')
// const { helperGenereateSlug } = require('../../../controllers/tours/helpers')

const helperTranslateTour = (tour) =>
  new Promise(async (resolve, reject) => {
    try {
      const { description, included } = tour
      const desc = await translateSingle(description).catch(() => description)
      resolve({
        ...tour,
        description: desc,
        included: await serviceStructureRequestTranslate(included, [
          'title',
          'description'
        ]).catch(() => included)
      })
    } catch (error) {
      console.log(error)
      reject('ERROR_TRANSLATE_TOUR')
    }
  })
module.exports = { helperTranslateTour }
