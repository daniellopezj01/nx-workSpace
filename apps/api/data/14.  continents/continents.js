// eslint-disable-next-line import/no-extraneous-dependencies
const { ObjectID } = require('mongodb')

const json = [
  {
    _id: new ObjectID('60462642a5b0785374337177'),
    code: 'AF',
    name: 'África'
  },
  {
    _id: new ObjectID('604656526b3d2f16849e529d'),
    code: 'NA',
    name: 'América'
  },
  {
    _id: new ObjectID('604656686b3d2f16849e8e2f'),
    code: 'EU',
    name: 'Europa'
  },
  {
    _id: new ObjectID('604656736b3d2f16849eab93'),
    code: 'AS',
    name: 'Asia'
  },
  {
    _id: new ObjectID('604656996b3d2f16849ef23c'),
    code: 'AN',
    name: 'Oceania'
  }
]

module.exports = json
