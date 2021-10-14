const _ = require('lodash')

const helperSecurityFlight = (passengers, dataAirline) =>
  new Promise(async (resolve) => {
    const secureFlight = []
    const { includedMainAirline, listAirline } = dataAirline
    const onlyDefaultAirline = _.every(
      listAirline,
      (i) => i === process.env.MAIN_AIRLINE
    )
    _.map(passengers, async (i, index) => {
      const { gender, dateOfBirth, name, surname } = i
      const indexNumber = `${index + 1.1}`
      const personName = {
        DateOfBirth: dateOfBirth,
        Gender: gender,
        NameNumber: indexNumber,
        GivenName: name,
        Surname: surname
      }
      if (onlyDefaultAirline || !includedMainAirline) {
        secureFlight.push({
          SegmentNumber: 'A',
          PersonName: personName,
          VendorPrefs: {
            Airline: {
              Hosted: includedMainAirline
            }
          }
        })
      } else {
        _.map(listAirline, (airline, indexAirline) => {
          secureFlight.push({
            SegmentNumber: `${indexAirline + 1}`,
            PersonName: personName,
            VendorPrefs: {
              Airline: {
                Hosted: airline === process.env.MAIN_AIRLINE
              }
            }
          })
        })
      }
    })

    resolve(secureFlight)
  })

module.exports = { helperSecurityFlight }
