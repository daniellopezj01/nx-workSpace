const { matchedData } = require('express-validator')
const modelPayIntention = require('../../models/payIntention')
const { isIDGood, handleError } = require('../../middleware/utils')
const { getItem } = require('../../middleware/db')

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getIntention = async (req, res) => {
  try {
    req = matchedData(req)
    const { id } = req
    await isIDGood(id)
    const payIntention = await getItem(id, modelPayIntention)
    res.status(201).json(payIntention)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getIntention }
