const { ObjectID } = require('mongodb')
const faker = require('faker')

module.exports = [
  {
    _id: new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
    name: 'Super Administrator',
    email: 'admin@admin.com',
    password: '$2a$05$2KOSBnbb0r.0TmMrvefbluTOB735rF/KRZb4pmda4PdvU9iDvUB26',
    role: 'admin',
    verified: false,
    verification: '408d45d8-ce38-40e4-abab-af58bba062fb',
    city: 'Bucaramanga',
    country: 'Colombia',
    phone: {
      number: '+34 916 34 39 39',
      code: 'ES'
    },
    surname: 'test 2',
    referredCode: 'asvfsdav',
    accessToken: 'SzVDyJbCGRBfh_64C12dTJt37KgvSTDu7zKTW8liskjSX',
    typeReferred: new ObjectID('6061e77ada99821b1425b282'),
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('5aa1c2c35ef7a4e97b5e995b'),
    name: 'Simple user',
    email: 'user@user.com',
    password: '$2a$05$2KOSBnbb0r.0TmMrvefbluTOB735rF/KRZb4pmda4PdvU9iDvUB26',
    role: 'user',
    verified: false,
    verification: '3d6e072c-0eaf-4239-bb5e-495e6486148d',
    city: 'Bucaramanga',
    country: 'Colombia',
    phone: {
      number: '+34 916 34 39 39',
      code: 'ES'
    },
    surname: 'test 1',
    referredCode: 'sdcvv',
    typeReferred: new ObjectID('6061e77ada99821b1425b282'),
    accessToken: 'hEauAkrzyLiasDds353ENYnZ8Adb2JKZHNJyvNKPlRKm3',
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('5fa29a9584b39b13786fbfc2'),
    name: 'tercer usuario',
    email: 'user3@user3.com',
    password: '$2a$05$2KOSBnbb0r.0TmMrvefbluTOB735rF/KRZb4pmda4PdvU9iDvUB26',
    role: 'user',
    verified: true,
    typeReferred: new ObjectID('6061e77ada99821b1425b282'),
    verification: '3d6e072c-0eaf-4239-bb5e-495e6486148d',
    city: 'Bucaramanga',
    country: 'Colombia',
    phone: {
      number: '+34 916 34 39 39',
      code: 'ES'
    },
    surname: 'test 3',
    accessToken: '9_t-1PKw6hAVyCJwlqwiM-WKuXP7vp9SsKoQhzuuwlKpg',
    referredCode: 'WEfwef',
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]
