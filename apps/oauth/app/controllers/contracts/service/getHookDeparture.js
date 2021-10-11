const { webHooks } = require('../../../service/hooks')
/**
 *
 * @param idDeparture
 * @param payAmount
 */
const getHookDeparture = (idDeparture, payAmount, currentMachine) => {
  const { appSecret } = currentMachine
  webHooks.trigger(
    'buyTour',
    {
      id: idDeparture,
      intent: 'buyTour',
      payAmount
    },
    { appSecret }
  )
}

module.exports = { getHookDeparture }
