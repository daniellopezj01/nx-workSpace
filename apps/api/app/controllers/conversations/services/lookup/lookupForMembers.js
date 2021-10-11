const lookupForMembers = () => new Promise((resolve) => {
  resolve({
    $lookup: {
      from: 'users',
      let: { members: '$members' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [{ $in: ['$_id', '$$members'] }]
            }
          }
        },
        {
          $project: {
            name: 1,
            surname: 1,
            avatar: 1
          }
        }
      ],
      as: 'membersPromise'
    }
  })
})

module.exports = { lookupForMembers }
