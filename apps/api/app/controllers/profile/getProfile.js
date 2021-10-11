const utils = require('../../middleware/utils')
const { helperGetProfileDB } = require('./helpers')

const getProfile = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.user._id)
    res.status(200).json(await helperGetProfileDB(id))
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getProfile }
