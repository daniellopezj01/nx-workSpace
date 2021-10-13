const moment = require('moment')
const fs = require('fs')

const htmlForgetPassword = (object) => {
  return new Promise((resolve, reject) => {
    const url = 'https://mochileros.com.mx'
    fs.readFile(
      `${__dirname}/../../../../templates/forgot_password.html`,
      'utf8',
      (err, data = {}) => {
        if (err) {
          reject(err)
          return
        }
        data = data.replace(
          /USER_NAME/g,
          `${object.name || ''} ${object.surname || ''}`
        )
        data = data.replace(
          /CREATED_AT/g,
          moment(new Date()).format('DD MMM k:mm')
        )
        data = data.replace(/PLATFORM/g, 'Mochileros')
        data = data.replace(
          /MESSAGE_USER/g,
          'En el siguiente link podras restablecer tu contraseña.'
        )
        data = data.replace(
          /GO_TO/g,
          `${url}/auth/reset/${object.verification}`
        )
        data = data.replace(/AVATAR_PARAMS/g, object.avatar)
        resolve(data)
      }
    )
  })
}

module.exports = { htmlForgetPassword }
