const _ = require('lodash')
const WebHooks = require('node-webhooks')
const Machines = require('../../models/machines')
// const Hooks = require('../../models/hooks')

/**
 * Webhooks must loaded from db
 * @type {WebHooks}
 */
const webHooks = new WebHooks({
  db: {},
  httpSuccessCodes: [200, 201, 202, 203, 204]
})

const emitterWebHooks = webHooks.getEmitter()

const getMachines = async () => {
  const data = await Machines.find({ status: 'enabled' })
  const listSources = _.flattenDeep(_.map(data, 'sources'))
  _.forEach(listSources, (src) => {
    const { url, urlDev, trigger } = src
    const urlHook = (process.env.NODE_ENV === 'production' ? url : urlDev) || url
    webHooks
      .add(trigger, urlHook)
      .then(() => {
        console.log(`Loaded ${src.trigger} -- ${urlHook}`)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

const listenErrors = async () => {
  emitterWebHooks.on('*.failure', (shortname, statusCode, body) => {
    console.error(`Error on trigger webHook${shortname}with status code`, statusCode)
  })
}

const listenSuccess = async () => {
  emitterWebHooks.on('*.success', (shortname, statusCode, body) => {
    console.log(`Success on trigger webHook ${shortname} with status code`, statusCode)
  })
}

// const getHooks = async () => {
//   const data = await Hooks.find({})
//   for (const hook of data) {
//     const { target_url, action_trigger } = hook
//     webHooks
//       .add(action_trigger, target_url)
//       .then(() => {
//         console.log(`Hook loaded ${action_trigger} -- ${target_url}`)
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//   }
// }
listenErrors()
listenSuccess()
getMachines().then()
// getHooks.apply().then()

module.exports = { webHooks, emitterWebHooks }
