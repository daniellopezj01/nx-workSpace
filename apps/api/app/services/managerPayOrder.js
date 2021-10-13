/* eslint handle-callback-err: "off"*/
const model = require('../models/payOrder')
const utils = require('../middleware/utils')

exports.searchPayOrder = (idOperation) =>
  new Promise(async (resolve, reject) => {
    try {
      model
        .aggregate([
          {
            $match: { idOperation }
          }
        ])
        .exec((err, res) => {
          if (res && res.length) {
            resolve(res[0])
          } else {
            reject(utils.buildErrObject(422, 'PAY_ORDER_NOT_FOUND'))
          }
        })
    } catch (e) {
      reject(e)
    }
  })
