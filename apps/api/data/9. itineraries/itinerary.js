/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
const faker = require('faker')
const { ObjectID } = require('mongodb')

const json = [
  {
    _id: new ObjectID('5fa18b654087883d305e67f1'),
    itineraryName: 'LUGAR 1',
    itineraryDescription: '.',
    idTour: new ObjectID('5fa181b202945b26c456176a'),
    stringLocation: {
      city: 'París',
      country: 'Francia',
      neighborhood: 'cualquier locacion de Francia',
      coordinates: [faker.address.latitude(), faker.address.longitude()],
      countryCode: 213
    },
    details: [
      {
        title: 'Krabi',
        description:
          "After one final morning in paradise it's back on the coach to Phuket where our paradise adventure comes to an end. Have one final love-in with your travel fam, then take our transfer either to the airport or back to our start hotel."
      },
      {
        title: 'Phuket'
      }
    ],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('5fa18b6c4087883d305e67f4'),
    itineraryName: 'LUGAR 2',
    itineraryDescription: '.',
    idTour: new ObjectID('5fa181b202945b26c456176a'),
    stringLocation: {
      city: 'París',
      country: 'Francia',
      neighborhood: 'cualquier locacion de Francia',
      coordinates: [faker.address.latitude(), faker.address.longitude()]
    },
    details: [
      {
        title: 'Krabi',
        description:
          "After one final morning in paradise it's back on the coach to Phuket where our paradise adventure comes to an end. Have one final love-in with your travel fam, then take our transfer either to the airport or back to our start hotel."
      },
      {
        title: 'Phuket'
      }
    ],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
