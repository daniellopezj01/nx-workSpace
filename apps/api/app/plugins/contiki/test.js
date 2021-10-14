const { serviceRequestTranslate } = require('../deepTranslate/services')

const test = async ({ text }) =>
  new Promise(async (resolve, reject) => {
    try {
      if (text) {
        text = await serviceRequestTranslate(text)
        resolve({ msg: text })
      } else {
        reject({ msg: 'TEXT_PARAM_REQUIRED' })
      }
    } catch (error) {
      console.log(error)
      reject({})
    }
  })

module.exports = { test }
