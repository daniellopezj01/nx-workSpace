/* eslint-disable no-await-in-loop */
const _ = require('lodash')
const { translateSingle } = require('./translateSingle')

const translateArrayObject = (array, props = []) =>
  new Promise(async (resolve, reject) => {
    try {
      if (array.length && props.length) {
        Promise.all(
          _.chain(array)
            .map(async (i) => {
              for (let index = 0; index < props.length; index++) {
                const prop = props[index]
                if (i[prop]) {
                  i[prop] = await translateSingle(i[prop])
                }
              }
              return i
            })
            .value()
        )
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            console.log(err)
            reject('ERROR_TRANSLATE_ARRAY')
          })
      } else {
        reject('ARRAY_OR_PROPERTIES_EMPTY')
      }
    } catch (error) {
      console.log('translateArray', error.message)
      reject('ERROR_TRANSLATE_OBJECT')
    }
  })

module.exports = { translateArrayObject }
