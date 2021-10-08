const utils = require('../../middleware/utils')
const { serviceManagerPost } = require('../blogs/services')

const getItemsBlog = async (req, res) => {
  try {
    const response = await serviceManagerPost()
    res.status(200).json({ data: response })
  } catch (error) {
    utils.handleError(res, { code: 404 })
  }
}

module.exports = { getItemsBlog }
