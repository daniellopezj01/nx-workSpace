/* eslint-disable no-undef */
const Settings = require('../../../models/settings')

const serviceUpdateTokenSettings = async (instaFeed) => {
  await Settings.updateOne({}, { instaFeed }, (err, item))
}

module.exports = { serviceUpdateTokenSettings }
