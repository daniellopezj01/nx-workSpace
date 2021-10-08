const slugify = require('slugify')
const nano = require('nanoid/non-secure')
const modelTour = require('../../../models/tour')
const db = require('../../../middleware/db')

const helperGenereateSlug = (text) => new Promise(async (resolve) => {
  let slug = slugify(text, {
    replacement: '-',
    remove: /[*+~.()'"!:@&%$#]/g,
    lower: true
  })
  if (await db.findOneBoolean({ slug }, modelTour)) {
    slug = `${slug}-${nano.customAlphabet('1234567890', 2)()}`
  }
  resolve(slug)
})

module.exports = { helperGenereateSlug }
