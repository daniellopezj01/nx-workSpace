const { checkIsNotDeleted } = require('./checkIsNotDeleted')

const lookupBestDeparture = (
  key = '$_id',
  limit = true,
  isAdmin = false
) => new Promise(async (resolve, reject) => {
  try {
    const idDeleted = await checkIsNotDeleted()
    const match = !isAdmin ? {
      $or: [{ status: 'visible' }, { status: 'OK' }, { status: true }]
    } : {}
    resolve({
      $lookup: {
        from: 'departures',
        let: { idTour: key },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$$idTour', '$idTour'] }]
              },
              $and: idDeleted,
              ...match
            }
          },
          { $sort: { normalPrice: 1 } },
          { $limit: limit ? 1 : 1000 }
          // {
          //   $addFields: {
          //     s: {
          //       $toDate: '$startDateDeparture'
          //     }
          //   }
          // },
          // {
          //   $addFields: {
          //     e: {
          //       $toDate: '$endDateDeparture'
          //     }
          //   }
          // },
          // {
          //   $project: {
          // days: {
          //   $trunc: {
          //     $divide: [
          //       {
          //         $subtract: ['$e', '$s']
          //       },
          //       86400000
          //     ]
          //   }
          // },
          // start: '$startDateDeparture',
          // end: '$endDateDeparture',
          // normalPrice: '$normalPrice',
          // close: '$closeDateDeparture',
          // stock: '$stock',
          // payAmount: '$payAmount',
          // description: '$description',
          // _id: limit ? 0 : 1
          // }
          // }
        ],
        as: 'departures'
      }
    })
  } catch (error) {
    reject(error)
  }
})

module.exports = { lookupBestDeparture }
