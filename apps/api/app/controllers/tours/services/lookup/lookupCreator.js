const lookupCreator = (nameField = 'guide', key = '$idUser') => new Promise((resolve) => {
  resolve({
    $lookup: {
      from: 'users',
      let: { idUser: key },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$$idUser', '$_id'] }]
            }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            surname: 1,
            avatar: 1,
            email: 1
          }
        }
      ],
      as: nameField
    }
  })
})

module.exports = { lookupCreator }
