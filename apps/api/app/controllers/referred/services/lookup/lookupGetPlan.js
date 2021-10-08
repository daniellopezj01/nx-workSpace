const lookupGetPlan = (nameField = 'plan', key = '$planReferred') => new Promise((resolve) => {
  resolve({
    $lookup: {
      from: 'referredsettings',
      let: { idPlan: key },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $eq: ['$$idPlan', '$_id'] }]
            }
          }
        }
      ],
      as: nameField
    }
  })
})

module.exports = { lookupGetPlan }
