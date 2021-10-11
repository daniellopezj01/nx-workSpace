const { matchedData } = require('express-validator')
// const {customFind, getItem} = require('../../middleware/db')

const utils = require('../../middleware/utils')
const { helperGenerateBasicAuth } = require('./helpers')

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
  try {
    const data = matchedData(req)
    const urlOauth = process.env.OAUHT_URL || null
    const baseToken = await helperGenerateBasicAuth()
    const header = {
      'Axios-Redis-Cache-Duration': null,
      Authorization: `Basic ${baseToken}`
    }
    utils.httpRequest$(`${urlOauth}/register`, 'post', header, data).subscribe(
      async (response) => {
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

module.exports = { register }
