/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker')
const { ObjectID } = require('mongodb')

const json = [
  {
    _id: new ObjectID('5fa181b202945b26c456176a'),
    status: 'publish',
    category: [new ObjectID('5fa17e9b02945b26c4561759')],
    comments: [
      {
        status: 'public',
        attachment: [],
        customData: [],
        _id: new ObjectID('5ffe5b503efc2d1624545b2a'),
        content: 'auxiliary tan',
        idUser: new ObjectID('5aa1c2c35ef7a4e97b5e995b'),
        idReservation: new ObjectID('5e4446f4ad05592a1c628977'),
        vote: 5,
        dateCreate: '2021-01-13T02:30:40.877Z'
      }
    ],
    transport: [
      {
        key: 'TR',
        name: 'Bus'
      },
      {
        key: 'BR',
        name: 'Tren'
      }
    ],
    attached: [
      {
        source: {
          original:
            'https://photo.hotellook.com/image_v2/limit/8671284970/800/520.auto',
          small:
            'https://photo.hotellook.com/image_v2/limit/8671284970/800/520.auto',
          medium:
            'https://photo.hotellook.com/image_v2/limit/8671284970/800/520.auto',
          large:
            'https://photo.hotellook.com/image_v2/limit/8671284970/800/520.auto'
        },
        type: 'image',
        fileName: '11459928-fa70-4945-9a4c-2e14522d3fa1.png'
      }
    ],
    tags: [],
    included: [],
    notIncluded: [],
    likes: [],
    featured: 'regular',
    type: 'departures',
    continent: ['EU', 'AS'],
    title: 'tour one',
    subTitle: 'conocer medellin',
    route: 'medellin santa fe de antioquia',
    idUser: new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
    slug: 'tour-one',
    countries: [
      {
        _id: '5fa18e5e4087883d305e6814',
        name_en: 'Afghanistan',
        name_es: 'Afganistán',
        code: 'AF'
      },
      {
        _id: '5fa18e5e4087883d305e6815',
        name_en: 'Argentina',
        name_es: 'Argentina',
        code: 'AR'
      },
      {
        _id: '5fa18e5e4087883d305e6816',
        name_en: 'Cocos (Keeling) Islands',
        name_es: 'Islas Cocos',
        code: 'CC'
      }
    ],
    cities: [
      {
        _id: '5fa18e5e4087883d305e6817',
        cityName: 'Berlín',
        countryName: 'Alemania',
        countryCode: 'DE',
        location: {
          lat: '52.520603',
          lon: '13.408907'
        }
      },
      {
        _id: '5fa18e5e4087883d305e6818',
        cityName: 'Barcelona',
        countryName: 'España',
        countryCode: 'ES',
        location: {
          lon: '2.170066',
          lat: '41.387089'
        }
      },
      {
        _id: '5fa18e5e4087883d305e6819',
        cityName: 'París',
        countryName: 'Francia',
        countryCode: 'FR',
        location: {
          lon: '2.342587',
          lat: '48.85634'
        }
      }
    ],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    _id: new ObjectID('5fa17f2d02945b26c456175c'),
    status: 'publish',
    comments: [],
    category: [new ObjectID('5fa17e9b02945b26c4561759')],
    transport: [
      {
        key: 'TR',
        name: 'Bus'
      },
      {
        key: 'BR',
        name: 'Tren'
      }
    ],
    attached: [
      {
        source: {
          original:
            'https://photo.hotellook.com/image_v2/limit/8671284970/800/520.auto',
          small:
            'https://photo.hotellook.com/image_v2/limit/8671284970/800/520.auto',
          medium:
            'https://photo.hotellook.com/image_v2/limit/8671284970/800/520.auto',
          large:
            'https://photo.hotellook.com/image_v2/limit/8671284970/800/520.auto'
        },
        type: 'image',
        fileName: '11459928-fa70-4945-9a4c-2e14522d3fa1.png'
      }
    ],
    included: [],
    notIncluded: [],
    likes: [],
    tags: [],
    featured: 'regular',
    type: 'departures',
    continent: ['EU'],
    title: 'tour two',
    subTitle: 'conocer madrid',
    route: 'madrid santa fe de antioquia',
    idUser: new ObjectID('5aa1c2c35ef7a4e97b5e995a'),
    slug: 'tour-two',
    countries: [
      {
        _id: '5fa18e5e4087883d305e6814',
        name_en: 'Afghanistan',
        name_es: 'Afganistán',
        code: 'AF'
      },
      {
        _id: '5fa18e5e4087883d305e6815',
        name_en: 'Argentina',
        name_es: 'Argentina',
        code: 'AR'
      },
      {
        _id: '5fa18e5e4087883d305e6816',
        name_en: 'Cocos (Keeling) Islands',
        name_es: 'Islas Cocos',
        code: 'CC'
      }
    ],
    cities: [
      {
        _id: '5fa18e5e4087883d305e6817',
        cityName: 'Berlín',
        countryName: 'Alemania',
        countryCode: 'DE',
        location: {
          lat: '52.520603',
          lon: '13.408907'
        }
      },
      {
        _id: '5fa18e5e4087883d305e6818',
        cityName: 'Barcelona',
        countryName: 'España',
        countryCode: 'ES',
        location: {
          lon: '2.170066',
          lat: '41.387089'
        }
      },
      {
        _id: '5fa18e5e4087883d305e6819',
        cityName: 'París',
        countryName: 'Francia',
        countryCode: 'FR',
        location: {
          lon: '2.342587',
          lat: '48.85634'
        }
      }
    ],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }
]

module.exports = json
