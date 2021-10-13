const { listenerAvatar } = require('./listener')
const { serviceAvatar } = require('./service')

const getAvatar = (urlAvatar, machine) => new Promise(async (resolve, reject) => {
  listenerAvatar()
    .then((res) => {
      resolve(res)
    })
    .catch((err) => {
      reject(err)
    })
  await serviceAvatar(urlAvatar, machine)
})

module.exports = { getAvatar }
