const { checkIsNotDeleted } = require('./checkIsNotDeleted')

const getItineraries = (key = '$_id') => new Promise(async (resolve) => {
  const idDeleted = await checkIsNotDeleted()
  const arrayPipe = []
  arrayPipe.push({
    $match: {
      $expr: {
        $and: [{ $eq: ['$$idTour', '$idTour'] }]
      },
      $and: idDeleted
    }
  })
  arrayPipe.push({ $sort: { sort: 1 } })
  resolve({
    $lookup: {
      from: 'itineraries',
      let: { idTour: key },
      pipeline: arrayPipe,
      as: 'itinerary'
    }
  })
})

module.exports = { getItineraries }
