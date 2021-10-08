const _ = require('lodash')
const moment = require('moment')
const utils = require('../../middleware/utils')
const { getAllData } = require('./getAllData')
const settingsModel = require('../../models/settings')
const db = require('../../middleware/db')

const assignedChangeCurrency = () => new Promise(async (resolve, reject) => {
  try {
    const params = {
      adultsCount: '1',
      segments: [
        {
          origin: 'MEX',
          destination: 'CUN',
          date: moment().add(10, 'week').format('YYYY-MM-DD')
        }, {
          origin: 'CUN',
          destination: 'MEX',
          date: moment().add(12, 'week').format('YYYY-MM-DD')
        }
      ]
    }
    const { itineraries } = await getAllData(params, false)
    const singleData = _.head(itineraries)
    const { currencyConversion } = singleData?.pricingInformation[0].fare.passengerInfoList[0].passengerInfo
    const object = { value: currencyConversion, name: 'sabreCurrency' }
    const setting = await db.findOneBoolean({ key: 'sabreCurrency' }, settingsModel)
    if (setting) {
      await db.updateItem(setting._id, settingsModel, object)
    } else {
      object.key = 'sabreCurrency'
      await db.createItem(object, settingsModel)
    }
    resolve(object)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_AUTH_SABRE')
  }
})

module.exports = { assignedChangeCurrency }
