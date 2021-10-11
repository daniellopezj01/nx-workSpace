const { buildErrObject } = require('../utils')

const findOne = (query, model, show = '') => {
  return new Promise((resolve, reject) => {
    model.findOne(query, show, async (err, item) => {
      console.log(err)
      if (err || !item) {
        reject(buildErrObject(422, 'NOT_FOUND'))
      }
      resolve(item)
    })
  })
}

module.exports = { findOne }
