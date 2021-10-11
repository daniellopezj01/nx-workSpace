const { serviceGetPost } = require('./serviceGetPost')
const { serviceRefreshTokenLongLive } = require('./serviceRefreshTokenLongLive')
const { serviceUpdateTokenSettings } = require('./serviceUpdateTokenSettings')
const { serviceExchangeTokenLongLive } = require('./serviceExchangeTokenLongLive')

module.exports = {
  serviceGetPost,
  serviceRefreshTokenLongLive,
  serviceExchangeTokenLongLive,
  serviceUpdateTokenSettings
}
