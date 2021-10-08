const lookupDeparture = () => new Promise(async (resolve) => {
  resolve({
    $lookup: {
      from: 'departures',
      let: { idDeparture: '$idDeparture' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$$idDeparture', '$_id'] }]
            }
          }
        },
        {
          $project: {
            _id: 0,
            startDateDeparture: 1,
            endDateDeparture: 1,
            closeDateDeparture: 1,
            payAmount: 1,
            currencies: 1,
            infoToReservation: 1
          }
        }
      ],
      as: 'asDeparture'
    }
  })
})

module.exports = { lookupDeparture }
