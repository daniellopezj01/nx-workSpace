const mongoose = require('mongoose')
const { lookupCreator } = require('../../tours/services/lookup')

const serviceGetItems = async (query = {}, author = null) => new Promise(async (resolve) => {
  if (author) {
    query = {
      ...query,
      ...{
        $and: [{ idUser: mongoose.Types.ObjectId(author._id) }]
      }
    }
  }

  const user = await lookupCreator('traveller')
  resolve([
    user,
    {
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
          }
        ],
        as: 'tour'
      }
    },
    {
      $lookup: {
        from: 'departures',
        let: { idDeparture: '$idDeparture' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$$idDeparture', '$_id'] }]
              }
            }
          }
        ],
        as: 'departure'
      }
    },
    {
      $lookup: {
        from: 'payorders',
        let: { idReservation: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$$idReservation', '$idReservation'] }]
              }
            }
          },
          {
            $project: {
              _id: 1,
              currency: 1,
              status: 1,
              createdAt: 1,
              platform: 1,
              amount: 1
            }
          }
        ],
        as: 'payorders'
      }
    },
    { $unwind: '$traveller' },
    { $unwind: '$tour' },
    { $unwind: '$departure' },
    {
      $match: query
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,
        code: 1,
        amount: 1,
        departure: 1,
        travelerFirstName: 1,
        travelerLastName: 1,
        travelerPhone: 1,
        status: 1,
        tour: 1,
        traveller: 1,
        totalPay: { $sum: '$payorders.amount' },
        totalSubtract: {
          $subtract: ['$amount', { $sum: '$payorders.amount' }]
        }
      }
    }
  ])
})

module.exports = { serviceGetItems }
