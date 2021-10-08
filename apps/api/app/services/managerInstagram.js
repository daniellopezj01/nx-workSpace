// const axios = require('axios')
// const Settings = require('../models/settings')
// const utils = require('../middleware/utils')

// const getAPI = () => {
//   return new Promise((resolve) => {
//     Settings.findOne({}, 'instaFeed', (err, item) => {
//       resolve(item)
//     })
//   })
// }

// const getUrlExchange = async (token) => {
//   const url = [
//     'https://graph.instagram.com/access_token',
//     '?grant_type=ig_exchange_token',
//     `&client_secret=${process.env.INSTA_SECRET}`,
//     '&access_token='
//   ]
//   const urlToken = `${url.join('')}${token}`
//   return axios.get(urlToken)
// }

// const getUrlRefresh = async (token) => {
//   const url = [
//     'https://graph.instagram.com/refresh_access_token',
//     '?grant_type=ig_refresh_token',
//     '&access_token='
//   ]
//   const urlToken = `${url.join('')}${token}`
//   return axios.get(urlToken)
// }

// /**
//  * Function for exchange SHORT TOKEN to LONG LIVE
//  */
// exports.exchangeTokenLongLive = async () => {
//   const instaKey = (await getAPI()) || null
//   return getUrlExchange(instaKey.instaFeed)
//   // return axios.get(`${url}&per_page=8`)
// }

// /**
//  * Function for exchange SHORT TOKEN to LONG LIVE
//  */
// exports.refreshTokenLongLive = async () => {
//   const instaKey = (await getAPI()) || null
//   return getUrlRefresh(instaKey.instaFeed)
//   // return axios.get(`${url}&per_page=8`)
// }

// /**
//  * Function for exchange SHORT TOKEN to LONG LIVE
//  */
// exports.updateTokenSettings = async (instaFeed) => {
//   await Settings.updateOne({}, { instaFeed }, (err, item))
// }

// /**
//  * Function for exchange SHORT TOKEN to LONG LIVE
//  */

// exports.getPost = async () => {
//   const instaKey = (await getAPI()) || null
//   const url = [
//     'https://graph.instagram.com/me/media?fields=',
//     'caption,media_url,media_type,permalink,timestamp,username',
//     '&access_token='
//   ]
//   const urlToken = `${url.join('')}${instaKey.instaFeed}&limit=12`
//   return new Promise((resolve, reject) => {
//     utils.httpRequest$(urlToken, 'get').subscribe(
//       (res) => {
//         resolve(res)
//       },
//       () => reject(null)
//     )
//   })
// }
