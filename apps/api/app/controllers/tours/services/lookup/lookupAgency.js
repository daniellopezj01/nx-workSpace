const lookupAgency = (nameField = 'infoAgency', key = '$accountAgency') => new Promise((resolve) => {
  resolve({
    $lookup: {
      from: 'users',
      let: { agency: key },
      pipeline: [
        {
          $match: {
            $and: [
              {
                $expr: {
                  $and: [
                    { $eq: ['$$agency', '$_id'] }
                  ]
                }
              }
              // { accountStripe: { $exists: true } }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            surname: 1,
            avatar: 1,
            email: 1,
            accountStripe: 1
          }
        }
      ],
      as: nameField
    }
  })
})

module.exports = { lookupAgency }
