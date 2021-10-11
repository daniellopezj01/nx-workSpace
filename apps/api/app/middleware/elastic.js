const elastic = require('../services/elastic.service')

const indexPattern = process.env.ELASTIC_INDEX || 'test_index'

exports.log = (req, res, next) => {
  if (process.env.ELASTIC_STATUS === 'true') {
    elastic.elasticClient.index({
      index: indexPattern,
      body: {
        tenantId: req.clientAccount || null,
        url: req.url,
        method: req.method,
        user: req.user || null,
        body: ['GET'].includes(req.method) ? req.query : req.body
      }
    })
  }
  next()
}
