const utils = require('../../../../middleware/utils')

const filterQ = (q, array = undefined) => new Promise(async (resolve, reject) => {
  try {
    q = q.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    q = new RegExp(`.*${q}.*`, 'i')
    const newArray = array || []
    newArray.push({ title: { $regex: q } })
    newArray.push({ subTitle: q })
    newArray.push({ route: q })
    resolve(newArray)
  } catch (error) {
    utils.buildErrObjectReject(error, reject, '422', 'ERROR_FITER_PARAM_Q')
  }
})

module.exports = { filterQ }
