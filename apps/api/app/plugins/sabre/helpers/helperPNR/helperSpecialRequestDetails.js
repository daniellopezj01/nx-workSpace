/* eslint-disable max-len */
const _ = require('lodash')
const { helperSecurityFlight } = require('./helperSecurityFlight')

const helperStructure = (key, value = 'value') => {
  return {
    SSR_Code: key,
    PersonName: {
      NameNumber: '1.1'
    },
    Text: value,
    SegmentNumber: 'A'
  }
}

const helperSpecialRequestDetails = (
  objectFlight,
  activeSecurityFlight = false
) =>
  new Promise(async (resolve, reject) => {
    try {
      const { passengers, emergency, includedMainAirline } = objectFlight
      const service = []
      _.map(passengers, async (i, index) => {
        const { passDocument } = i
        const indexNumber = `${index + 1.1}`
        service.push({
          SSR_Code: 'FOID',
          PersonName: {
            NameNumber: indexNumber
          },
          Text: passDocument,
          VendorPrefs: {
            Airline: {
              Hosted: includedMainAirline
            }
          },
          SegmentNumber: 'A'
        })
      })
      service.push(
        helperStructure('CTCM', emergency?.phone.internationalNumber.slice(1))
      )
      service.push(helperStructure('CTCE', emergency?.email.replace('@', '//')))
      const secureFlight = await helperSecurityFlight(passengers, objectFlight)
      let securityFlight = {}
      if (!activeSecurityFlight) {
        securityFlight = {
          SecureFlight: secureFlight,
          Service: service
        }
      }
      resolve({
        SpecialService: {
          SpecialServiceInfo: securityFlight
        }
      })
    } catch (error) {
      reject()
    }
  })

module.exports = { helperSpecialRequestDetails }
