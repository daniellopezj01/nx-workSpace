const Settings = require('../../../models/settings')

const helpergetAPI = () => {
  return new Promise((resolve) => {
    Settings.findOne({}, 'instaFeed', (err, item) => {
      resolve(item)
    })
  })
}

module.exports = {
  helpergetAPI
}
