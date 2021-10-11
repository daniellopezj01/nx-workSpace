const utils = require('../../middleware/utils')
const { serviceGetProfileReferred } = require('./services')

const getReferredById = async (req, res) => {
  try {
    res.status(200).json(await serviceGetProfileReferred(req.user._id))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getReferredById }
