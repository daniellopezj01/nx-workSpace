const utils = require('../../../middleware/utils')

const serviceGetItemsAdmin = (query) =>
  new Promise(async (resolve, reject) => {
    try {
      const aggregate = [
        {
          $match: query
        },
        {
          $project: {
            _id: 1,
            title: 1,
            status: 1,
            subTitle: 1,
            route: 1,
            createdAt: 1,
            updatedAt: 1,
            idUser: 1,
            id: 1
          }
        },
        {
          $sort: {
            id: 1
          }
        }
      ]
      resolve(aggregate)
    } catch (e) {
      console.log(e)
      reject(utils.buildErrObject(422, e.message))
    }
  })

module.exports = { serviceGetItemsAdmin }
