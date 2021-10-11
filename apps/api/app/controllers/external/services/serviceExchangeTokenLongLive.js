/**
 * Function for exchange SHORT TOKEN to LONG LIVE
 */

const { helpergetAPI, helperGetUrlExchange } = require('../helpers')

const serviceExchangeTokenLongLive = async () => {
  const instaKey = (await helpergetAPI()) || null
  return helperGetUrlExchange(instaKey.instaFeed)
  // return axios.get(`${url}&per_page=8`)
}

module.exports = { serviceExchangeTokenLongLive }
