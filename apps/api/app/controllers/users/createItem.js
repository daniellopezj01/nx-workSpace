const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const createItem = async (req, res) => {
  try {
    const { accessToken } = req.user
    req = matchedData(req)
    const { DEFAULTPASSWORD } = process.env
    req = { ...req, accessToken, password: DEFAULTPASSWORD }
    const { url, header } = await utils.structureRequest()
    utils.httpRequest$(`${url}/users`, 'post', header, req).subscribe(
      (response) => {
        res.status(200).json(response)
      },
      (err) => {
        utils.handleErrorHooks(res, err)
      }
    )
  } catch (error) {
    utils.handleError(res, error)
  }
}
module.exports = { createItem }
