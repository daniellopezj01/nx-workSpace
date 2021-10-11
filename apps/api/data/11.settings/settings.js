/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
const { ObjectID } = require('mongodb')

module.exports = [
  {
    _id: new ObjectID('6045ed30cb085d67f07e6c66'),
    name: 'Mochileros V3',
    key: 'defaultCurrencies',
    currencies: [
      {
        name: 'USD',
        value: 1,
        currency: 'US'
      },
      {
        name: 'EUR',
        value: 0.85,
        currency: 'ES'
      }
    ],
    payAmount: [
      100,
      10,
      15,
      25,
      30,
      50
    ],
    instaFeed: 'IGQVJWXzAwaWdUQXZAOaHYyMjJ6eWJ3bjNTLXhkRW0xNVI5VW1WWGxyOUNDY09fYUQwU3pyclF2QXJPM0lzamhoZAHBVb3dxMmZAqN19oT2ZAJTkZA3VkE4ZATB1d2l0Qk1abWJRS1p4ZAGxn'
  },
  {
    _id: new ObjectID('608afdf887569aca2418fdea'),
    key: 'defaultEmail',
    email: 'atencion@mochileros.com.mx',
    name: 'mochileros'
  }
]
