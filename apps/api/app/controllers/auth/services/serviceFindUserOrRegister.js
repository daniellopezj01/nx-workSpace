const nanoid = require('nanoid')
const user = require('../../../models/user')
const { serviceFindReferredPlan } = require('../../referredSettings/services')
const {
  helperRegisterUser,
  setUserInfo,
  returnRegisterToken,
  generateToken, helperDownload
} = require('../helpers')

const serviceFindUserOrRegister = (req) => new Promise(async (resolve, reject) => {
  try {
    const userFind = await user.findOne({ email: req.email }).catch((err) => { console.log(err.message) })
    if (!userFind) {
      const plan = (await serviceFindReferredPlan()) || null
      req.typeReferred = plan !== null ? plan._id : null
      const item = await helperRegisterUser(req)
      const userInfo = await setUserInfo(item)
      const response = await returnRegisterToken(item, userInfo)
      if (req.avatar) {
        const pathName = `./public/media/tmp_${nanoid.nanoid()}_image.png`
        helperDownload(`${req.avatar}`, pathName, item)
      }
      resolve(response)
    }
    userFind.set('accessToken', req.accessToken)
    userFind.save()
    resolve({
      token: generateToken(userFind._id),
      user: userFind
    })
  } catch (error) {
    reject()
  }
})

module.exports = { serviceFindUserOrRegister }
