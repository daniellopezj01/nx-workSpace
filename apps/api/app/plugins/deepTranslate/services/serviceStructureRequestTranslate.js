const _ = require('lodash')
const utf8 = require('utf8')
const { serviceRequestTranslate } = require('./serviceRequestTranslate')

const serviceStructureRequestTranslate = (data, props = []) => new Promise(async (resolve, reject) => {
  try {
    if (data.length && props.length) {
      const arrayText = []
      _.map(data, (i) => {
        for (let index = 0; index < props.length; index++) {
          const prop = props[index]
          const singleText = i[prop]
          if (singleText) {
            const textParam = `&text=${utf8.encode(singleText.replace(/[^a-zA-Z0-9]/g, ' '))}`
            arrayText.push(textParam)
          }
        }
      })
      let translate = await serviceRequestTranslate(arrayText)
      translate = _.chunk(translate, props.length)
      const objectTranslate = _.map(translate, (i, index) => {
        let object = {}
        _.map(i, (o, indexProp) => {
          object = {
            ...object,
            [props[indexProp]]: o.text
          }
        })
        return { ...data[index], ...object }
      })
      // console.log(JSON.stringify(objectTranslate, null, 2))
      resolve(objectTranslate)
    } else {
      throw new Error('Parameter is not an array')
    }
  } catch (error) {
    console.log(error)
    reject('ERROR_STRUCTURE_TRANSLATE')
  }
})

module.exports = { serviceStructureRequestTranslate }
