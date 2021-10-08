const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const { serviceDownloadImage } = require('../storage/services')

const createAvatar = async (req, res) => {
  try {
    req = matchedData(req)
    const { url } = req
    const avatar = await serviceDownloadImage(url)
    res.status(200).json(avatar)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { createAvatar }
