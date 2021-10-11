/* eslint-disable import/no-extraneous-dependencies */
const { ObjectID } = require('mongodb')
const faker = require('faker')

const json = [
  {
    _id: new ObjectID('60d4b2f2cda87fac149a409a'),
    name: 'zapier mexico',
    appId: '1',
    appSecret: '2',
    status: 'enabled',
    origin: [],
    urlRedirect: 'http://localhost:4200/auth/callback',
    sources: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    endpoint: []
  }
]

module.exports = json
