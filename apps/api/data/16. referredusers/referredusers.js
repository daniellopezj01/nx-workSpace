const { ObjectID } = require('mongodb')
const faker = require('faker')

const json = [
  {
    _id: new ObjectID('606c9e766a0400533e8382ed'),
    status: 'available',
    amountFrom: 90,
    amountTo: 50,
    userTo: new ObjectID('5aa1c2c35ef7a4e97b5e995b'),
    userFrom: new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
    planReferred: new ObjectID('6061e77ada99821b1425b282'),
    code: '10686609',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('606afb0e7337c52808047fad'),
    status: 'available',
    amountFrom: 90,
    amountTo: 50,
    userTo: new ObjectID('5fa29a9584b39b13786fbfc2'),
    userFrom: new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
    planReferred: new ObjectID('6061e77ada99821b1425b282'),
    code: '2A2B4959',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
