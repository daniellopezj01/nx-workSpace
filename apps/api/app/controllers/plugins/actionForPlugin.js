const { matchedData } = require('express-validator')
const model = require('../../models/plugins')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')

const PATH_PLUGINS = '../../plugins'

const actionForPlugin = async (req, res) => {
  try {
    req = matchedData(req)
    const { id, action, params } = req
    await db.findOne({ path: id }, model)
    // eslint-disable-next-line import/no-dynamic-require
    const singleModule = require(`${PATH_PLUGINS}/${id}`)
    const data = await singleModule[action](params)
    res.status(200).json(data)
  } catch (error) {
    // console.log('error plugin',error.message)
    error = {
      code: 422,
      message: error.message ? error.message : 'ERROR_INTERNAL',
      error
    }
    utils.handleError(res, error)
  }
}

module.exports = { actionForPlugin }
