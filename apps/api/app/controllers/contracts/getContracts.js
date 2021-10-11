const { matchedData } = require('express-validator')
const utils = require('../../middleware/utils')
/*********************
 * Private functions *
 *********************/

/********************
 * Public functions *
 ********************/

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getContracts = async (req, res) => {
  try {
    const { accessToken } = req.user
    req = matchedData(req)
    req = { ...req, accessToken }
    const { url, header } = await utils.structureRequest()
    utils
      .httpRequest$(`${url}/payIntention/pay-intent`, 'post', header, req)
      .subscribe(
        (response) => {
          delete response.accessToken
          res.status(200).json(response)
        },
        (err) => {
          console.log(err.message)
          utils.handleErrorHooks(res, err)
        }
      )
  } catch (error) {
    console.log(error.message)
    utils.handleError(res, error)
  }
}

module.exports = { getContracts }
