const fs = require('fs')

const htmlLinkAgency = (template = '', userAgency) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${__dirname}/../../../templates/${template}.html`,
      'utf8',
      (err, data = {}) => {
        if (err) {
          reject(err)
          return
        }
        const {
          name, surname, accountStripe, email
        } = userAgency
        data = data.replace(/NAME_AGENCY/g, `${name} ${surname || ''}`)
        data = data.replace(/EMAIL_AGENCY/g, email)
        data = data.replace(/ACCOUNT_AGENCY/g, accountStripe)
        resolve(data)
      }
    )
  })
}

module.exports = { htmlLinkAgency }
