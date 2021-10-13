const { itemNotFound } = require('../utils')

const customFind = (qry = '', model = {}, single = true) => {
  return new Promise((resolve, reject) => {
    model[!single ? 'find' : 'findOne'](qry, async (err, item) => {
      try {
        await itemNotFound(err, item, 'NOT_FOUND')
        resolve(item)
      } catch (error) {
        reject(error)
      }
    })
  })
}

module.exports = { customFind }
