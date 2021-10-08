/**
 * Function for exchange SHORT TOKEN to LONG LIVE
 */
const { helpergetAPI, helperGetUrlRefresh } = require('../helpers')

const serviceRefreshTokenLongLive = async () => {
  const instaKey = (await helpergetAPI()) || null
  return helperGetUrlRefresh(instaKey.instaFeed)
  // return axios.get(`${url}&per_page=8`)
}

module.exports = { serviceRefreshTokenLongLive }
