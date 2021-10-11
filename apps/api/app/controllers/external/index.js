const { getItemsInstagram } = require('./getItemsInstagram')
const { getItemsBlog } = require('./getItemsBlog')
const { refreshToken } = require('./refreshToken')
const { addPicturesToTours } = require('./addPicturesToTours')

module.exports = {
  getItemsInstagram,
  getItemsBlog,
  refreshToken,
  addPicturesToTours
}
