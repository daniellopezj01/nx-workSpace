/* eslint-disable handle-callback-err */
/* eslint-disable max-statements */
const _ = require('lodash')
const {
  lookupForWord,
  lookupItinerary,
  lookupComments,
  lookupScore
} = require('./lookup')
const model = require('../../../models/tour')
const utils = require('../../../middleware/utils')

const serviceMainSearch = (wordsSearch) =>
  new Promise(async (resolve, reject) => {
    wordsSearch = wordsSearch.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    wordsSearch = new RegExp(`.*${wordsSearch}.*`, 'i')
    try {
      const queryForQ = await lookupForWord(wordsSearch)
      const lookComments = await lookupComments()
      const dataItinerary = await lookupItinerary(queryForQ, wordsSearch)
      const score = await lookupScore()
      let aggregate = []
      aggregate = _.concat(aggregate, dataItinerary)
      aggregate = _.concat(aggregate, lookComments)
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
      aggregate.push({
        $project: {
          duration: 1,
          status: 1,
          score: 1,
          title: 1,
          _id: 1,
          slug: 1,
          id: 1
        }
      })
      aggregate.push({
        $sort: { id: 1 }
      })
      aggregate.push({ $limit: 4 })
      model.aggregate(aggregate).exec((err, res) => {
        if (res && res.length) {
          resolve(res)
        } else {
          resolve([])
        }
      })
    } catch (e) {
      console.log(e)
      reject(utils.buildErrObject(422, e.message))
    }
  })

module.exports = { serviceMainSearch }
