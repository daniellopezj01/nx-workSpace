// const utf8 = require('utf8')
const utils = require('../../../middleware/utils')

const serviceRequestTranslate = (text = []) =>
  new Promise(async (resolve, reject) => {
    try {
      // text = text.length ? text : utf8.encode(text.replace(/[^a-zA-Z0-9]/g, ' '))
      const base = 'https://api.deepl.com/v2/translate?'
      const params = [
        `auth_key=${process.env.KEY_TRANSLATE}`,
        text,
        `&target_lang=${process.env.DEFAULT_LENGUAGE_TRANSLATE}`
      ].join('')
      const url = `${base}${params}`
      utils.httpRequest$(url, 'post').subscribe(
        async (res) => {
          const { translations } = res
          // console.log('peticion translate longitud', translations.length)
          resolve(translations)
        },
        (error) => {
          console.log('ERROR_TRANSLATE_RESPONSE->>', error.message)
          utils.buildErrObjectReject(error, reject, '422', 'ERROR_TRANSLATE')
        }
      )
    } catch (error) {
      utils.buildErrObjectReject(error, reject, '422', 'ERROR_TRANSLATE')
    }
  })

module.exports = { serviceRequestTranslate }
