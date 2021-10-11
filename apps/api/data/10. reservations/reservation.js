/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker')
const { ObjectID } = require('mongodb')

const json = [
  {
    _id: new ObjectID('5fa18bde4087883d305e6800'),
    travelerFirstName: 'daniel',
    travelerLastName: 'Lopez',
    travelerEmail: 'admin@admin.com',
    idIntentions: '606f09e4b3e2493710be7d52',
    travelerPhone: {
      number: '+57 314 3605160',
      code: 'CO'
    },
    travelerDocument: '32130132053',
    travelerAddress: 'km 12 av 45-8',
    travelerBirthDay: '07-10-2020',
    travelerGender: 'F',
    code: '665-446',
    status: 'pending',
    amount: 588.9,
    idDeparture: new ObjectID('5f7dd6b56ce74a8e3ff15add'),
    country: 'Colombia',
    idTour: new ObjectID('5fa181b202945b26c456176a'),
    idUser: new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
    deleted: false,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
