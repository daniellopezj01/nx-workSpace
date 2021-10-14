const utils = require('../../../middleware/utils')
const { lookupComments, lookupScore } = require('./lookup')
/**
 * ALL Tours main search
 */
const serviceGetItems = (match) =>
  new Promise(async (resolve, reject) => {
    try {
      const lookComments = await lookupComments()
      const aggregate = []
      const score = await lookupScore()
      aggregate.push({ $match: match }) // filtros de categoria, continent, y duracion.
      aggregate.push(lookComments)
      aggregate.push({
        $addFields: {
          comments: {
            $reduce: {
              input: '$allComments',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this.insideComments'] }
            }
          }
        }
      })
      aggregate.push(score[0])
      aggregate.push(score[1])
      const project = {
        _id: 1,
        // attached: 1,
        category: 1,
        continent: 1,
        countries: 1,
        createdAt: 1,
        duration: 1,
        route: 1,
        slug: 1,
        title: 1,
        idExternal: 1,
        score: 1,
        lenguages: 1,
        departures: 1,
        // attached: {
        //   $arrayElemAt: ['$attached', 0]
        // }
        attached: {
          $first: '$attached'
        }
      }
      aggregate.push({
        $project: project
      })
      // aggregate.push({
      //   $sort: {
      //     idExternal: 1
      //   }
      // })
      resolve(aggregate)
    } catch (e) {
      console.log(e.message)
      reject(utils.buildErrObject(422, e.message))
    }
  })

module.exports = { serviceGetItems }
