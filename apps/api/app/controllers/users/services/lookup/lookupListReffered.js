const { lookupPlanReferreals } = require('./lookupPlanReferreals')

const lookuListReferred = async (query) =>
  new Promise(async (resolve) => {
    const lookupPlan = await lookupPlanReferreals()
    const aggregate = [
      {
        $lookup: {
          from: 'users',
          let: { usetTo: '$userTo' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$_id', '$$usetTo'] }]
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                surname: 1,
                email: 1,
                avatar: 1
              }
            }
          ],
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $match: query
      },
      lookupPlan
    ]
    resolve(aggregate)
  })

module.exports = { lookuListReferred }
