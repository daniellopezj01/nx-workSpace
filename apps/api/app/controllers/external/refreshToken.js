const utils = require('../../middleware/utils')

const { serviceRefreshTokenLongLive, serviceUpdateTokenSettings } = require('./services')

const refreshToken = async (req, res) => {
  try {
    const response = await serviceRefreshTokenLongLive()
    await serviceUpdateTokenSettings(response.data.access_token)
    res.status(200).json({ data: response.data })
  } catch (error) {
    utils.handleError(res, { code: 404 })
  }
}

module.exports = { refreshToken }
