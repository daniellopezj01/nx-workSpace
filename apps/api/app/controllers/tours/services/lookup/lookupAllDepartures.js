const { checkIsNotDeleted } = require('./checkIsNotDeleted')

const lookupAllDepartures = (keyName = 'departures', allStatus = false) =>
  new Promise(async (resolve) => {
    const pipelineArray = []
    const isDeleted = await checkIsNotDeleted()
    if (!allStatus) {
      isDeleted.push({
        $or: [{ status: 'visible' }, { status: 'OK' }, { status: true }]
      })
    }
    pipelineArray.push({
      $match: {
        $expr: {
          $and: [{ $eq: ['$$idTour', '$idTour'] }]
        },
        $and: isDeleted
      }
    })
    // if (showOnlyActive) {
    // pipelineArray.push({
    //   $match: {
    //     $or: [{ status: true }, { status: 'OK' }]
    //   }
    // })
    // }
    pipelineArray.push({
      $addFields: {
        parseDate: {
          $dateFromString: {
            dateString: '$startDateDeparture',
            format: '%d-%m-%Y'
          }
        },
        shortDate: {
          $dateToString: {
            format: '%Y-%m-01',
            date: {
              $dateFromString: {
                dateString: '$startDateDeparture',
                format: '%d-%m-%Y'
              }
            }
          }
        }
      }
    })
    resolve({
      $lookup: {
        from: 'departures',
        let: { idTour: '$_id' },
        pipeline: pipelineArray,
        as: keyName
      }
    })
  })

module.exports = { lookupAllDepartures }
