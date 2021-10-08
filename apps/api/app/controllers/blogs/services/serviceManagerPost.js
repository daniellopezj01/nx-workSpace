const utils = require('../../../middleware/utils')

const url = 'https://elclubmochilero.com/wp-json/wp/v2/posts?_embed'

const serviceManagerPost = () => {
  return new Promise((resolve, reject) => {
    utils.httpRequest$(`${url}&per_page=8`, 'get').subscribe(
      (res) => {
        resolve(res)
      },
      () => reject(null)
    )
  })
}

module.exports = { serviceManagerPost }
