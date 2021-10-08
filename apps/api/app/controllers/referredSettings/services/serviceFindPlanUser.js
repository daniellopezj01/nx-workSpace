const db = require('../../../middleware/db')
const modelPlan = require('../../../models/settingReferred')

const serviceFindPlanUser = async (typeReferred) => new Promise(async (resolve) => {
  resolve(await db.getItem(typeReferred, modelPlan))
})

module.exports = { serviceFindPlanUser }
