const axios = require('axios')

const helperGetUrlRefresh = async (token) => {
  const url = [
    'https://graph.instagram.com/refresh_access_token',
    '?grant_type=ig_refresh_token',
    '&access_token='
  ]
  const urlToken = `${url.join('')}${token}`
  return axios.get(urlToken)
}

module.exports = { helperGetUrlRefresh }
