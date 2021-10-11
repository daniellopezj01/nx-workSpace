const { matchedData } = require('express-validator')
const Model = require('../../models/user')
const settingReferred = require('../../models/settingReferred')
const utils = require('../../middleware/utils')
const db = require('../../middleware/db')
const { helperPublicDataUser, helperCheckRefferredOrId } = require('./helpers')

const getItemPublic = async (req, res) => {
  try {
    req = matchedData(req)
    const query = await helperCheckRefferredOrId(req.id)
    const send = await db.findOne(query, Model)
    const { typeReferred } = send
    const user = await helperPublicDataUser(send)
    user.plan = await db.getItem(typeReferred, settingReferred)
    res.status(200).json(user)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getItemPublic }
