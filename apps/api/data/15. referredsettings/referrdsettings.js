// eslint-disable-next-line import/no-extraneous-dependencies
const { ObjectID } = require('mongodb')
const faker = require('faker')

const json = [
  {
    _id: new ObjectID('6061e77ada99821b1425b282'),
    amountFrom: 90,
    amountTo: 50,
    name: 'Referido Regular',
    label: 'Referido Regular',
    withdraw: false,
    terms: 'Referido Regular',
    default: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('6061e7b6da99821b14263354'),
    amountFrom: 150,
    amountTo: 0,
    name: 'Agencia',
    label: 'Agencia',
    withdraw: false,
    terms: 'Agencia',
    default: true,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
