/* eslint-disable import/no-extraneous-dependencies */
const { ObjectID } = require('mongodb')
const faker = require('faker')

const json = [
  {
    _id: new ObjectID('5fa17e4802945b26c4561758'),
    name: 'technology',
    icon: 'test',
    description: 'prueba realizada',
    color: 'red',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
