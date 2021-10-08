const _ = require('lodash')
const utils = require('../../middleware/utils')
const {
  serviceGetTourContinents
} = require('./services/serviceGetTourContinents')

const getForContinents = async (req, res) => {
  try {
    const data = await serviceGetTourContinents()
    Object.values(data).map((a) => {
      a.continent = _.head(a.continent)
      return a
    })
    res.status(200).json(data)
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = {
  getForContinents
}
