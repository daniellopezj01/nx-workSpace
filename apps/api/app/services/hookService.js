const WebHooks = require('node-webhooks')
const _ = require('lodash')
const Hooks = require('../models/hooks')

const webHooks = new WebHooks({
  db: { get: ['http://localhost:9100/posts'] },
  httpSuccessCodes: [200, 201, 202, 203, 204]
})

const getHooks = async () => {
  const data = await Hooks.find({ status: 'enabled' })
  const listSources = _.compact(_.flattenDeep(_.map(data, 'sources')))
  _.forEach(listSources, (src) => {
    const { url, urlDev, trigger } = src
    const urlHook =
      (process.env.NODE_ENV === 'production' ? url : urlDev) || url
    webHooks
      .add(trigger, urlHook)
      .then(() => {
        console.log(`Loaded ${src.trigger} -- ${urlHook}`)
      })
      .catch((err) => {
        console.log('getHooks', err.message)
      })
  })
}

getHooks()

const emitterWebHooks = webHooks.getEmitter()

module.exports = { webHooks, emitterWebHooks }
