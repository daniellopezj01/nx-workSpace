const faker = require('faker')
const { ObjectID } = require('mongodb')

const json = [
  {
    _id: new ObjectID('5ffb6b5bd3ecb1183861e936'),
    title: 'Términos y Condiciones',
    description: 'prueba realizada',
    slug: 'terminos-y-condiciones',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    userCreator: {
      name: 'administrador',
      surname: 'test 2',
      email: 'admin@admin.com'
    }
  }
]

module.exports = json
