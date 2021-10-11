const moment = require('moment')

const createDate = (date, daysToAdd) => new Promise((resolve) => {
  let newDate
  if (daysToAdd) {
    newDate = moment(date, 'YYYY-MM-DD-HH:mm').add('d', 1).format('YYYY-MM-DD[T]HH:mm:ss')
  } else {
    newDate = moment(date, 'YYYY-MM-DD-HH:mm').format('YYYY-MM-DD[T]HH:mm:ss')
  }
  resolve(newDate)
})

const helperStructureTime = (currentDate, singleFlight) => new Promise(async (resolve) => {
  const { departure, arrival, departureDateAdjustment } = singleFlight
  const departureDateTime = `${currentDate.slice(0, 10)}:${departure.time.slice(0, 5)}`
  const arrivalDateTime = `${currentDate.slice(0, 10)}:${arrival.time.slice(0, 5)}`
  const formatDateOrigin = await createDate(departureDateTime, departureDateAdjustment)
  const formatDateArrive = await createDate(arrivalDateTime, departureDateAdjustment)
  resolve([formatDateOrigin, formatDateArrive])
})

module.exports = { helperStructureTime }
