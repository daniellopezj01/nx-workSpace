const _ = require('lodash')
const utf8 = require('utf8')
const { serviceRequestTranslate } = require('./services')

const translateSingle = async (params = '') => new Promise(async (resolve, reject) => {
  try {
    if (params) {
      params = await serviceRequestTranslate([`&text=${utf8.encode(params.replace(/[^a-zA-Z0-9]/g, ' '))}`])
      const data = _.head(params)
      resolve(data.text)
    } else {
      reject({ msg: 'TEXT_PARAM_REQUIRED' })
    }
  } catch (error) {
    console.log(error)
    reject('ERROR_TRANSLATE_SINGLE')
  }
})

module.exports = { translateSingle }
