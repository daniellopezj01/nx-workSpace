const { ObjectID } = require('mongodb')

const faker = require('faker')

const json = [
  {
    _id: '5fa29a9584b39b13786fbfc2',
    members: [
      new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
      new ObjectID('5aa1c2c35ef7a4e97b5e995b')
    ],
    type: 'single',
    messages: [
      {
        _id: '5fa2c3cf193c6239c40d7d85',
        message: 'otro test',
        creator: '5aa1c2c35ef7a4e97b5e995a',
        dateCreate: '2020-11-04T12:12:05.761Z'
      }
    ],
    hash: '0Je0su8WqkndG_Qe2foaz',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
