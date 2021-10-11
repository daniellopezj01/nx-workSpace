const modelSetting = require('../../../models/settings')
const db = require('../../../middleware/db')

const helperArrayCurrencies = () => new Promise(async (resolve) => {
  const setting = await db.findCheckSingle(modelSetting)
  const { currencies } = setting
  resolve(currencies)
})

module.exports = { helperArrayCurrencies }
