const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
const { serviceGetItems } = require('./services')
/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getItem = async (req, res) => {
  try {
    const idUser = req.user._id
    const parameters = matchedData(req)
    const data = await serviceGetItems(parameters, idUser)
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItem }
