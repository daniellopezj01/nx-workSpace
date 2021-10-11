const slugify = require('slugify')

const helperGenerateSlug = (title) => new Promise(async (resolve) => {
  const slugText = slugify(title, {
    replacement: '-',
    remove: /[*+~.()'"!:@&%$#]/g,
    lower: true
  })
  resolve(slugText)
})

module.exports = {
  helperGenerateSlug
}
