const { matchedData } = require('express-validator')
const { handleError } = require('../../middleware/utils')
const { findOne } = require('../../middleware/db')
const modelMachine = require('../../models/machines')
/**
 * Principal route called
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const principal = async (req, res) => {
  try {
    const data = matchedData(req)
    if (data.redirect) {
      res.setHeader('Content-Security-Policy', '')
      data.domain = process.env.NODE_ENV === 'production' ? process.env.SERVER_AUTH : process.env.SERVER_AUTH_TEST
      const tenant = await findOne({ name: 'Pagina Web' }, modelMachine, 'appId -_id')
      data.tenant = tenant.appId
      res.render('login.hbs', data)
    } else {
      res.send({ MESSAGE: 'REDIRECT' })
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { principal }
