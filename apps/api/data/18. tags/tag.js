/* eslint-disable import/no-extraneous-dependencies */
const { ObjectID } = require('mongodb')
const faker = require('faker')

const json = [
  {
    _id: new ObjectID('605e170474cf5e3253e68c6f'),
    name: 'tren',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('60cc8ec1b3ee44400ce5d171'),
    name: 'naturaleza',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
