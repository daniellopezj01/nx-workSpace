const utils = require('../../middleware/utils')
const { serviceGetTokenSabre } = require('./services/servicesAuth')
const db = require('../../middleware/db')
const flightModel = require('../../models/validateFlights')
const { emailExternal } = require('../../middleware/emailer/emailExternal')

const generatePnr = (locale, { params }, user) => new Promise(async (resolve, reject) => {
  try {
    const { code } = params
    const token = await serviceGetTokenSabre()
    const headers = await utils.structureTokenBearer(token)
    const flight = await db.findOne({ code }, flightModel)
    const { paramsPnr } = flight
    const url = `${process.env.URL_SABRE}/v2.4.0/passenger/records?mode=create`
    // const url = 'https://api-crt.cert.havail.sabre.com/v2.4.0/passenger/records?mode=create'
    console.log('url pnr , ', url)
    utils.httpRequest$(url, 'post', headers, paramsPnr).subscribe(
      async (res) => {
        const { ApplicationResults, ItineraryRef: idPnr } = res.CreatePassengerNameRecordRS
        const { status: statusPnr } = ApplicationResults
        const object = { statusPnr }
        let typeMessage = ''
        if (statusPnr === 'Complete') {
          object.idPnr = idPnr.ID
          typeMessage = 'successPnr'
        } else {
          object.errorPnr = ApplicationResults
          typeMessage = 'errorPnr'
        }
        const data = await db.updateItem(flight._id, flightModel, object).catch((err) => { console.log(err) })
        emailExternal(locale, data, typeMessage, user)
        resolve(data)
      },
      (error) => {
        console.log('error generate PNR', error.message)
      }
    )
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_GENERATE_PNR_SABRE')
  }
})

module.exports = { generatePnr }
