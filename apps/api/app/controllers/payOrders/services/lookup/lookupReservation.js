const lookupReservation = (nameField = 'reservation') =>
  new Promise((resolve) => {
    resolve({
      $lookup: {
        from: 'reservations',
        let: { idReservation: '$idReservation' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$$idReservation', '$_id'] }]
              }
            }
          },
          {
            $project: {
              _id: 1,
              code: 1,
              idUser: 1
            }
          }
        ],
        as: nameField
      }
    })
  })

module.exports = { lookupReservation }
