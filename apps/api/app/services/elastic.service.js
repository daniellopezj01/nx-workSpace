const { Client } = require('@elastic/elasticsearch')

const client =
  process.env.ELASTIC_STATUS === 'true'
    ? new Client({
        node: process.env.ELASTIC_NODE,
        auth: {
          username: process.env.ELASTIC_USER,
          password: process.env.ELASTIC_PASS
        }
      })
    : null

const indexPattern = process.env.ELASTIC_INDEX || 'test_index'

const settings = {
  size: 10,
  delay: 250,
  index: indexPattern
}

/**
 * Use only on models
 * @param {*} data
 */
exports.interceptorModel = (data) => {
  if (process.env.NODE_ENV !== 'production') {
    client.index({
      index: indexPattern,
      body: JSON.parse(JSON.stringify(data))
    })
  }
}
/**
 * Use middleware in routes
 */
exports.elasticClient = client

exports.settings = settings

exports.pack = {
  esClient: client,
  index: settings.index,
  bulk: {
    index: settings.index,
    size: settings.size,
    delay: settings.delay
  }
}
