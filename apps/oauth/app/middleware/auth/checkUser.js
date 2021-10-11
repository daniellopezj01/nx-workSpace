const Machines = require('../../models/machines')
const { customFind } = require('../db')

const checkUser = async (req, res, next) => {
  try {
    const data = req.header('Authorization')
    const bufferExt = data.split(' ')[1]
    const buff = Buffer.from(bufferExt, 'base64')
    const text = buff.toString()
    const appId = text.split(':')[0]
    const appSecret = text.split(':')[1]
    req.currentMachine = await customFind(
      { appId, appSecret, status: 'enabled' },
      Machines
    )
    next()
  } catch (e) {
    res.status(422).json({ error: 'NOT_BASIC_AUTH' })
  }

  // return basicAuth({
  //   users: { 'admin': 'supersecret' }
  // });
}

module.exports = { checkUser }
