const lookupTour = () => new Promise(async (resolve) => {
  resolve({
    $lookup: {
      from: 'tours',
      let: { idTour: '$idTour' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$$idTour', '$_id'] }]
            }
          }
        },
        {
          $project: {
            _id: 0,
            title: 1,
            attached: 1
          }
        }
      ],
      as: 'asTour'
    }
  })
})

module.exports = { lookupTour }
