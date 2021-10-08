const { checkIsNotDeleted } = require('./checkIsNotDeleted')

const lookupItinerary = (query, searchValue) => new Promise(async (resolve) => {
  const idDeleted = await checkIsNotDeleted()
  resolve([
    { $limit: 1 },
    { $project: { _id: '$$REMOVE' } },
    {
      $lookup: {
        from: 'tours',
        // pipeline: [{ $match: query }, { $project: { _id: 1 } }],
        pipeline: [
          { $match: { ...query, ...{ status: 'publish' } } },
          { $project: { _id: 1 } }
        ],
        as: 'colTours'
      }
    },
    {
      $lookup: {
        from: 'itineraries',
        pipeline: [
          {
            $match: {
              $or: [
                { itineraryName: searchValue },
                { 'stringLocation.city': searchValue },
                { 'stringLocation.country': searchValue },
                { 'stringLocation.neighborhood': searchValue }
              ],
              $and: idDeleted
            }
          },
          { $project: { _id: '$idTour' } }
        ],
        as: 'itinerary'
      }
    },
    { $project: { union: { $concatArrays: ['$colTours', '$itinerary'] } } },
    { $unwind: '$union' },
    { $replaceRoot: { newRoot: '$union' } },
    {
      // eliminar los _ids repetidos.
      $group: {
        _id: '$_id'
      }
    },
    {
      // traer  los datos de los _ids anteriores
      $lookup: {
        from: 'tours',
        let: { idTour: '$_id', tourStatus: 'publish' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$$idTour', '$_id'] },
                  { $eq: ['$$tourStatus', '$status'] }
                ]
              }
            }
          }
        ],
        as: 'tour'
      }
    },
    {
      // proyectar solo los datos del tour, sin el id anterior
      $unwind: '$tour'
    },
    {
      // asignarlo como cabezera.
      $replaceRoot: {
        newRoot: '$tour'
      }
    }
  ])
})

module.exports = {
  lookupItinerary
}
