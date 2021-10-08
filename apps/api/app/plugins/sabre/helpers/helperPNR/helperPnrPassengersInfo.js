const _ = require('lodash')

const helperPnrPassengersInfo = (passengers = []) => new Promise(async (resolve, reject) => {
  if (passengers.length) {
    const emails = []
    const phones = []
    const generalInfo = []
    _.map(passengers, (i, index) => {
      const nameNumber = `${index + 1.1}`
      const {
        email, name, surname, phone, type
      } = i
      const phoneNumber = phone.internationalNumber.slice(1)
      emails.push({
        NameNumber: nameNumber,
        Address: email
      })
      generalInfo.push({
        NameNumber: nameNumber,
        GivenName: name,
        PassengerType: type,
        Surname: surname
      })
      phones.push({
        NameNumber: nameNumber,
        Phone: phoneNumber,
        PhoneUseType: 'H'
      })
    })
    const objectPessengersInfo = {
      ContactNumbers: {
        ContactNumber: phones
      },
      Email: emails,
      PersonName: generalInfo
    }
    resolve(objectPessengersInfo)
  } else {
    reject('PESSENGERS_IS_EMPTY')
  }
})

module.exports = { helperPnrPassengersInfo }
