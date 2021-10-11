const md5 = require('md5')
const { matchedData } = require('express-validator')
const Machines = require('../../models/machines')
const User = require('../../models/user')
const { handleError } = require('../../middleware/utils')
const { customFind, getItem } = require('../../middleware/db')

/**
 * Private function
 */

const findUser = async (idUser) => {
  // eslint-disable-next-line no-return-await
  return await getItem(idUser, User)
}

const checkSignature = async (appId, signature, user, origin) => {
  const dataMachine = await customFind(
    {
      appId,
      status: 'enabled',
      origin: { $in: ['*', origin] }
    },
    Machines
  )
  const { appSecret } = dataMachine
  const encryptSignature = md5(`${user._id}.${appSecret}`)
  return signature === encryptSignature
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getMachine = async (req, res) => {
  try {
    const origin = req.get('origin') || null
    const user = req.user._id
    req = matchedData(req)
    const { id, signature } = req
    const check = await checkSignature(id, signature, user, origin)

    if (check) {
      const data = {
        user: await findUser(user._id)
      }
      res.status(201).json(data)
    } else {
      res.status(401).json({ revSignature: 'SIGNATURE_FAIL' })
    }
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getMachine }
