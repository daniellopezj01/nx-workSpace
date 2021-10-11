const { webHooks } = require('../../../service/hooks')
/**
 *
 * @param idDeparture
 * @param payAmount
 */
const serviceAvatar = (url, currentMachine) => {
  const { appSecret } = currentMachine
  webHooks.trigger(
    'avatar',
    {
      url
    },
    { appSecret }
  )
}

module.exports = { serviceAvatar }
