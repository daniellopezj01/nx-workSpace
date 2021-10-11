const axios = require('axios')

const helperGetUrlExchange = async (token) => {
  const url = [
    'https://graph.instagram.com/access_token',
    '?grant_type=ig_exchange_token',
    `&client_secret=${process.env.INSTA_SECRET}`,
    '&access_token='
  ]
  const urlToken = `${url.join('')}${token}`
  return axios.get(urlToken)
}

module.exports = { helperGetUrlExchange }
