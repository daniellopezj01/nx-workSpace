const pluginHotels = require('../../plugins/travelpayouts-api-hotels/index')
const utils = require('../../middleware/utils')
const { serviceMainSearch } = require('./services')

const getToursAndPlaces = async (req, res) => {
  try {
    const data = {}
    const { query, lang } = req.query
    if (query) {
      data.places = await pluginHotels.search_place({ query, lang })
      data.tours = await serviceMainSearch(query)
      res.status(200).json(data)
    } else {
      utils.handleError(res, { code: 404, message: 'Params Error' })
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

module.exports = { getToursAndPlaces }
