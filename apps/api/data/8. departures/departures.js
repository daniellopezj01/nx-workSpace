/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker')
const { ObjectID } = require('mongodb')

const json = [
  {
    _id: new ObjectID('5f7dd6b56ce74a8e3ff15add'),
    payAmount: [100, 20],
    status: 'OK',
    customData: [],
    startDateDeparture: '23-11-2021',
    endDateDeparture: '18-12-2021',
    stock: 25,
    minStock: 18,
    normalPrice: 948.99,
    specialPrice: 588.9,
    closeDateDeparture: '15-11-2020',
    flight: false,
    idTour: new ObjectID('5fa181b202945b26c456176a'),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('5fa1831e02945b26c4561774'),
    stock: 35,
    minAge: 18,
    status: 'OK',
    flight: false,
    customData: {
      idDeparture: '226'
    },
    startDateDeparture: '01-08-2021',
    endDateDeparture: '10-08-2021',
    description: '',
    minStock: 15,
    maxAge: 40,
    normalPrice: 1000,
    closeDateDeparture: '01-07-2021',
    idTour: new ObjectID('5fa17f2d02945b26c456175c'),
    payAmount: [
      {
        startAt: faker.date.past(),
        endAt: faker.date.recent(),
        intent: 'buyTour',
        _id: new ObjectID('604a8cb2e9cd930979dac333'),
        percentageAmount: 100,
        discount: 'percentage',
        amountDiscount: 5,
        allowToAccumulate: true
      },
      {
        startAt: null,
        endAt: null,
        intent: 'buyTour',
        _id: new ObjectID('604bb5d7e9cd930979dac5df'),
        percentageAmount: 10,
        discount: 'none',
        amountDiscount: null,
        allowToAccumulate: false
      }
    ],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
