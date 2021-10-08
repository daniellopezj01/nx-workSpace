const { matchedData } = require('express-validator')
const _ = require('lodash')
const { serviceGetCommentsForUser } = require('./services')
const utils = require('../../middleware/utils')

const getForUser = async (req, res) => {
  try {
    req = matchedData(req)
    const data = await serviceGetCommentsForUser(req.idUser)
    Object.values(data).map((a) => {
      a.creatorComment = _.head(a.creatorComment)
      a.attached = _.head(a.attached)
    })
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getForUser }
