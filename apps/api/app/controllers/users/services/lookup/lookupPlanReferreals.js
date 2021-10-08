const lookupPlanReferreals = (key = '$planReferred', name = 'plan') => new Promise(async (resolve) => {
  resolve({
    $lookup: {
      from: 'referredsettings',
      let: { planReferred: key },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$$planReferred', '$_id'] }]
            }
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            label: 1
          }
        }
      ],
      as: name
    }
  })
})

module.exports = { lookupPlanReferreals }
