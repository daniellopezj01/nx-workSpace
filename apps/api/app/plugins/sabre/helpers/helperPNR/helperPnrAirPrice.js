const _ = require('lodash')
const settingsModel = require('../../../../models/settings')
const db = require('../../../../middleware/db')

const helperPnrAirPrice = (passengers = [], { price = {} }) =>
  new Promise(async (resolve, reject) => {
    const arrayAirPrice = []
    if (passengers.length) {
      _.map(passengers, (i, index) => {
        arrayAirPrice.push({
          PriceRequestInformation: {
            Retain: true,
            OptionalQualifiers: {
              PricingQualifiers: {
                NameSelect: [
                  {
                    NameNumber: `${index + 1.1}`
                  }
                ],
                PassengerType: [
                  {
                    Code: i.type,
                    Quantity: '1'
                  }
                ]
              }
            }
          }
        })
      })
      const first = _.head(arrayAirPrice)
      const numStr = String(price?.netPrice)
      const totalPrice = numStr.includes('.')
        ? parseFloat(numStr.replace('.', ''))
        : price?.netPrice
      const setting = await db.findOneBoolean(
        { key: 'sabreCurrency' },
        settingsModel
      )
      const newPrice = setting
        ? Number(parseInt(price?.netPrice / setting.value.exchangeRateUsed, 10))
        : totalPrice
      arrayAirPrice[0] = {
        PriceComparison: {
          // AmountSpecified: price?.totalPrice,
          AmountSpecified: newPrice,
          AcceptablePriceIncrease: {
            HaltOnNonAcceptablePrice: true,
            Amount: 200
          }
        },
        ...first
      }
      resolve(arrayAirPrice)
    } else {
      reject('ERROR_MAPPING_AIR_PRICE')
    }
  })

module.exports = { helperPnrAirPrice }
