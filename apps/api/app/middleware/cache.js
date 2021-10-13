const getExpeditiousCache = require('express-expeditious')

const withCache =
  process.env.USE_REDIS === 'true'
    ? getExpeditiousCache({
      namespace: 'expresscache',
      defaultTtl: '1 hour',
      engine: require('expeditious-engine-redis')({
        redis: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT
        }
      })
    })
    : null

const withOutCache = (req, res, next) => {
  next()
}

exports.cache = process.env.USE_REDIS === 'true' ? withCache : withOutCache
