const { webHooks } = require('../../../services/hookService')

const hookChangeStatusReservation = (oldReservation, newReservation) => {
  if (oldReservation.status !== newReservation.status) {
    console.log('Reservation changed - run trigger')
    webHooks.trigger('reservation.changed', newReservation)
  }
}

module.exports = { hookChangeStatusReservation }
