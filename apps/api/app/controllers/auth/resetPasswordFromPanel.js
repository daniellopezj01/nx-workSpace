const { matchedData } = require('express-validator')
// const {customFind, getItem} = require('../../middleware/db')

const utils = require('../../middleware/utils')
const { helperGenerateBasicAuth } = require('./helpers')
const db = require('../../middleware/db')
const model = require('../../models/user')

/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const resetPasswordFromPanel = async (req, res) => {
  try {
    const data = matchedData(req)
    const user = await db.getItem(data.id, model)
    data.accessToken = user.accessToken
    const urlOauth = process.env.OAUHT_URL || null
    const baseToken = await helperGenerateBasicAuth()
    const header = {
      'Axios-Redis-Cache-Duration': null,
      Authorization: `Basic ${baseToken}`
    }

    utils.httpRequest$(`${urlOauth}/resetPasswordFromAdmin`, 'post', header, data).subscribe(
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

module.exports = { resetPasswordFromPanel }
