const utils = require('../../../middleware/utils')
const { helpergetAPI } = require('../helpers')

const serviceGetPost = async () => {
  const instaKey = (await helpergetAPI()) || null
  const url = [
    'https://graph.instagram.com/me/media?fields=',
    'caption,media_url,media_type,permalink,timestamp,username',
    '&access_token='
  ]
  const urlToken = `${url.join('')}${instaKey.instaFeed}&limit=12`
  return new Promise((resolve, reject) => {
    utils.httpRequest$(urlToken, 'get').subscribe(
      (res) => {
        resolve(res)
      },
      (err) => {
        reject(err)
      }
    )
  })
}

module.exports = {
  serviceGetPost
}
