const { helperFindUserByRefCode } = require('../helpers')
const modelReferredUser = require('../../../models/referredUsers')
const SettingsReferred = require('../../../models/settingReferred')
const db = require('../../../middleware/db')
const { serviceCreateForReffered } = require('../../payOrders/services')

const serviceRegisterUserReferred = (codeRef, userTo) => new Promise(async (resolve, reject) => {
  try {
    const { user: userToReffered } = userTo
    const referredUser = await helperFindUserByRefCode(codeRef)
    if (referredUser.typeReferred) {
      const planReferred = await db.findOne({ _id: referredUser.typeReferred }, SettingsReferred)
      const { amountFrom, amountTo, _id: idPlanReffered } = planReferred
      const body = {
        userTo: userToReffered._id,
        userFrom: referredUser._id,
        amountFrom,
        amountTo,
        planReferred: idPlanReffered
      }
      const reffered = await db.createItem(body, modelReferredUser)
      const { code } = reffered
      const payOrder = await serviceCreateForReffered(userToReffered._id, amountTo, code)
      resolve(payOrder)
    } else {
      reject()
    }
  } catch (error) {
    console.log(error)
    reject()
  }
})

module.exports = { serviceRegisterUserReferred }
