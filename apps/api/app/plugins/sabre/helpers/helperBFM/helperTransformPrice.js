const _ = require('lodash')

const helperTransformPrice = (pricingInformation = {}, transformPrice) =>
  new Promise(async (resolve, reject) => {
    try {
      // const minPriceInformation = _.minBy(pricingInformation, 'fare.totalFare.totalPrice')
      // const { passengerInfoList } = minPriceInformation.fare
      // const minPriceItem = _.minBy(passengerInfoList, 'passengerInfo.passengerTotalFare.totalFare')
      // const { passengerTotalFare, currencyConversion } = minPriceItem.passengerInfo
      // const price = passengerTotalFare

      const headPricingInformation = _.head(pricingInformation)
      const { totalFare } = headPricingInformation.fare
      let price = totalFare
      const operationalCharges = Number(
        Math.trunc(price?.totalPrice * process.env.COMISSION_SABRE) / 100,
        2
      )
      const netPrice = price?.totalPrice
      if (transformPrice) {
        // console.log(price)
        // console.log(operationalCharges)
        price = {
          ...price,
          operationalCharges,
          netPrice,
          totalPrice: Number(operationalCharges + netPrice, 2)
        }
        // console.log(price)
      }
      resolve({ price })
    } catch (error) {
      console.log('ERROR> helperTransformPrice', error)
      reject('HELPER_tRANSFORM_PRICE')
    }
  })

module.exports = { helperTransformPrice }
