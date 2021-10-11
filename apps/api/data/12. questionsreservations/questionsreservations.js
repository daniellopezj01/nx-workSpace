/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
const { ObjectID } = require('mongodb')
const faker = require('faker')

module.exports = [
  {
    _id: new ObjectID('6035014000c0712dcc000368'),
    title: '',
    position: 0,
    status: 'public',
    question: '¿Estas de acuerdo con compartir habitacion?',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('6035018700c0712dcc000369'),
    title: '',
    position: 0,
    status: 'public',
    question: '¿Estas dispuesto a caminar durante mas de 3 horas?',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('603519da00c0712dcc0003b2'),
    title: '',
    position: 0,
    status: 'public',
    question: 'Algún retraso de tren, un dia con lluvia, un dia imprevisto. Son posibles en cada viaje ¿ Estas disúesto a viajar así?',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('60536b13cf2a9b33a085d6c9'),
    title: 'prueba',
    position: 0,
    status: 'private',
    question: 'Esta es una ultima prueba',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]
