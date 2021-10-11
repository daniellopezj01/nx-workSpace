const moment = require('moment')

const helperDescription = async (general, data) => {
  return new Promise(async (resolve) => {
    let description
    const {
      operationType, externalCode
    } = data
    if (general?.reservation) {
      const { reservation, tour, departure } = general
      const {
        code,
        travelerFirstName,
        travelerLastName
      } = reservation
      const { title } = tour
      const { startDateDeparture } = departure
      const date = moment(startDateDeparture, 'DD-MM-YYYY').format('DD [de] MMMM YYYY')
      description = `(${code}) ${travelerFirstName} ${travelerLastName || null} - ${title} (${date})`
    } else if (operationType && externalCode) {
      description = `${operationType}: ${externalCode}`
    } else {
      description = 'Abono a monedero'
    }
    resolve(description)
  })
}

module.exports = { helperDescription }
