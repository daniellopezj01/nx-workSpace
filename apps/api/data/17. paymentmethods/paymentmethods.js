// eslint-disable-next-line import/no-extraneous-dependencies
const { ObjectID } = require('mongodb')

const faker = require('faker')

const json = [
  {
    _id: new ObjectID('609a83290868257718dd8fb8'),
    default: false,
    deleted: false,
    name: 'Stripe Mexico',
    privateKeyProd: 'pending',
    publicKeyProd: 'test',
    privateKeyTest: 'sk_test_Ol9A3Us8sEUTbF9Fdtbv0aBU',
    publicKeyTest: 'pk_test_KHdnCRV3fKyCnrDdTsgLbOsl',
    idPayment: 'ca_GyG42wlPScTmPsxsNur981WzAcpbLmAd',
    currency: 'MXN',
    codePayment: '96714588',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('609a83790868257718dd8fb9'),
    default: true,
    deleted: false,
    name: 'Stripe España',
    privateKeyProd: 'pending',
    publicKeyProd: 'test',
    privateKeyTest: 'sk_test_sOPSzSKjhTuAg2CfaGQiiqlm',
    publicKeyTest: 'pk_test_Wj915HLpr6PpdvzQMuzq8idv',
    idPayment: 'ca_H1DyUceO8mdQIO5l1xnbYyafQzvunrC6',
    codePayment: '4M1M0584',
    currency: 'USD',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
