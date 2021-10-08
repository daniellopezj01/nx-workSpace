// eslint-disable-next-line import/no-extraneous-dependencies
const { ObjectID } = require('mongodb')

const faker = require('faker')

const json = [
  {
    _id: new ObjectID('604b9ae4bc4c9905c0044852'),
    status: 'enabled',
    userShouldSend: false,
    codeReservation: '665-446',
    customData: {
      _id: new ObjectID('608ad6e3564c624b2035c243'),
      travelerFirstName: 'pepito',
      travelerLastName: 'perez',
      travelerEmail: 'user@user.com',
      idTour: new ObjectID('5fa181b202945b26c456176a'),
      amount: 4361.445,
      idDeparture: new ObjectID('5f7dd6b56ce74a8e3ff15add'),
      code: '665-446',
      idUser: new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
      idIntention: new ObjectID('608ad6c4a857f29028841972'),
      tourTitle: 'Mundial Qatar 2022 - prueba',
      StartDate: '14-04-2021'
    },
    messages: [
      {
        _id: new ObjectID('604b9ae4bc4c9905c0044853'),
        message: '<p>prueba prueba prueba prueba </p>',
        creator: {
          name: '(E)Daniel',
          _id: new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
          surname: 'Lopez',
          email: 'admin@admin.com'
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      }
    ],
    hash: 'YPp_bWfeEWQV',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
