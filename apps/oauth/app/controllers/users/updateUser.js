const { matchedData } = require('express-validator')
const User = require('../../models/user')
const { isIDGood, handleError } = require('../../middleware/utils')
const { updateItem } = require('../../middleware/db')
const { emailExistsExcludingMyself } = require('../../middleware/emailer')
// const { webHooks } = require('../../service/hooks')
// const { detecChangeRole } = require('../../service/hooks/utils')

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const updateUser = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    const doesEmailExists = await emailExistsExcludingMyself(id, req.email)
    if (!doesEmailExists) {
      // const roleChange = await detecChangeRole(id, req)
      // if (roleChange) await webHooks.trigger('role.change', roleChange)
      res.status(200).json(await updateItem(id, User, req))
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { updateUser }
