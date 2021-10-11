const mongoose = require('mongoose')
const _ = require('lodash')
const Users = require('../../../models/user')

const allContractsByUser = async (idUser, intent) => {
  const response = await Users.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(idUser),
        contracts: { $exists: true }
      }
    },
    {
      $lookup: {
        from: 'contracts',
        let: { userContracts: '$contracts' }, // lista de contratos por usuario
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$userContracts']
              }
            }
          },
          {
            $match: {
              $expr: {
                $eq: ['$intent', intent]
              }
            }
          }
        ],
        as: 'contracts'
      }
    },
    {
      $project: {
        _id: 0,
        contracts: '$contracts'
      }
    }
  ])
  const singleFound = _.head(response) || null
  return singleFound ? singleFound.contracts : []
}

module.exports = { allContractsByUser }
