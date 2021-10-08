const utils = require('../../middleware/utils')
const { serviceGetPost } = require('./services')

const getItemsInstagram = async (req, res) => {
  try {
    const response = await serviceGetPost()
    res.status(200).json(response)
  } catch (error) {
    utils.handleError(res, { code: 404, message: error.message })
  }
}

module.exports = { getItemsInstagram }
