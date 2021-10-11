const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEYID || '',
  secretAccessKey: process.env.AWS_SECRETACCESSKEY || '',
  region: process.env.AWS_REGION || ''
})

module.exports = AWS
