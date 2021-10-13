const moment = require('moment')
const Contracts = require('../../../models/contracts')
const { customFind } = require('../../../middleware/db')

const allContracts = (allowToAccumulate, intent) => {
  return customFind(
    {
      allowToAccumulate,
      intent,
      status: 'enabled',
      $or: [
        {
          startAt: {
            $exists: true,
            $gte: moment().startOf('day').toDate()
          },
          endAt: {
            $exists: true,
            $lt: moment().endOf('day').toDate()
          }
        },
        {
          startAt: {
            $exists: false
          },
          endAt: {
            $exists: false
          }
        }
      ]
    },
    Contracts,
    false
  )
}

module.exports = { allContracts }
