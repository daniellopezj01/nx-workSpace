const modelSetting = require('../../../models/settings')
const db = require('../../../middleware/db')

const helperPercentages = () => new Promise(async (resolve) => {
  const setting = await db.findCheckSingle(modelSetting)
  const { payAmount } = setting
  resolve(payAmount)
})

module.exports = { helperPercentages }
