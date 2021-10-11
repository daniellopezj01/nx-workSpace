const SettingsReferred = require('../../../models/settingReferred')

const serviceFindReferredPlan = async () => new Promise((resolve) => {
  const plan = SettingsReferred.findOne({ default: true })
  resolve(plan)
})

module.exports = { serviceFindReferredPlan }
