const modelDeparture = require('../../../../models/departure')
const utils = require('../../../../middleware/utils')

const queryGetDeparturesForFilter = (match = { $or: [] }, minDate = false, maxDate = false) => new Promise(
  async (resolve, reject) => {
    try {
      match.$or = [
        ...[{ status: 'visible' }, { status: 'OK' }, { status: true }]
      ]
      match.$and.push(
        { $or: [{ deleted: false }, { deleted: undefined }] }
      )
      let aggregate = []
      if (minDate) {
        aggregate.push({
          $addFields: {
            start: {
              $toDate: '$startDateDeparture'
            }
          }
        })
      }
      if (maxDate) {
        aggregate.push({
          $addFields: {
            end: {
              $toDate: '$endDateDeparture'
            }
          }
        })
      }
      aggregate = [...aggregate, ...[
        {
          $match: match
        },
        {
          $sort: {
            idTour: 1,
            normalPrice: 1
          }
        },
        {
          $group: {
            _id: '$idTour',
            doc: {
              $first: '$$ROOT'
            }
          }
        },
        {
          $replaceRoot: {
            newRoot: '$doc'
          }
        },
        {
          $project: {
            normalPrice: 1,
            _id: 1,
            payAmount: 1,
            idTour: 1,
            start: 1,
            status: 1
          }
        }
      ]]
      // console.log(JSON.stringify(aggregate, null, 2))
      modelDeparture.aggregate(aggregate).exec((err, departures) => {
        if (err) throw err
        resolve(departures)
      })
    } catch (error) {
      utils.buildErrObjectReject(error, reject, '422', 'FILTER_MAIN_DEPARTURES')
    }
  }
)

module.exports = { queryGetDeparturesForFilter }
