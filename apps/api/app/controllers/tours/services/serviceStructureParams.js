const Modelcontinent = require('../../../models/continents')
const db = require('../../../middleware/db')

const serviceStructureParams = ({ query }) => new Promise(async (resolve, reject) => {
  const { duration, continents, price, category } = query
  let { query: q } = query
  const or = []
  const and = []
  const match = {}
  if (continents) {
    const currentContinent = await db.findOne({ code: continents }, Modelcontinent, '_id')
    and.push({
      array: {
        $elemMatch: {
          $eq: currentContinent
        }
      }
    })
  }
  if (q) {
    q = q.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    q = new RegExp(`.*${q}.*`, 'i')
    or.push({ title: { $regex: q } })
    or.push({ subTitle: q })
    or.push({ route: q })
  }
  if (or.length) {
    match.$or = or
  }
  if (and.length) {
    match.$and = and
  }
  resolve(match)
})

module.exports = { serviceStructureParams }
