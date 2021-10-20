/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')

const server = require('../../superTest')
const request = require('supertest')
const itinerary = require('../../app/models/itinerary')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}

let token = ''
let accessToken = ''
let idItinerary = ''
const createdID = []
const itineraryName = 'LUGAR 1'
const url = process.env.URL_TEST_ADMIN
const idTour = '5fa181b202945b26c456176a'
const changeNameItinerary = faker.random.words()
const newObject = {
  itineraryName,
  itineraryDescription: faker.random.words(),
  idTour,
  stringLocation: {
    city: faker.random.words(),
    country: faker.random.words(),
    countryCode: 'BE',
    coordinates: [faker.address.latitude(), faker.address.longitude()]
  },
  details: [
    {
      title: faker.random.words(),
      description: faker.random.words()
    },
    {
      title: faker.random.words()
    }
  ]
}


describe('*********** ITINERARIES_ADMIN ***********', () => {
  describe('/POST login', () => {
    test('it should GET token user', (done) => {
      request(server)
        .post(`${url}/login/`)
        .send(loginDetails)
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            accessToken: expect.any(String),
            user: expect.any(Object),
          }))
          const currentAccessToken = body.accessToken
          accessToken = currentAccessToken
          done()
        })
    })
    test('it should GET a fresh token', (done) => {
      request(server)
        .post(`${url}/exchange/`)
        .send({
          accessToken
        })
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            token: expect.any(String),
            user: expect.any(Object),
          }))
          const currentToken = body.token
          token = currentToken
          done()
        })
    })
  })
  describe('/GET itineraries', () => {
    test('it should GET all the itineraries', (done) => {
      request(server)
        .get(`${url}/itineraries`)
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body.docs).toBeInstanceOf(Array)
          const firstItinerary = _.head(body.docs)
          idItinerary = firstItinerary._id
          expect(firstItinerary).toEqual(expect.objectContaining({
            _id: expect.any(String),
            itineraryName: expect.any(String),
            itineraryDescription: expect.any(String),
            idTour: expect.any(String),
            stringLocation: expect.any(Object),
            details: expect.any(Array),
          }))
          expect(firstItinerary).toHaveProperty('idTour', idTour)
          done()
        })
    })
  })

  describe('/POST itineraries', () => {
    test('it should NOT POST a itinerary without itinerary', (done) => {
      const itineraryOne = {}
      request(server)
        .post(`${url}/itineraries`)
        .set('Authorization', `Bearer ${token}`)
        .send(itineraryOne)
        .expect(422)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors.msg).toBeInstanceOf(Object)
          done()
        })
    })
    test('it should POST a itineraries ', (done) => {
      request(server)
        .post(`${url}/itineraries`)
        .set('Authorization', `Bearer ${token}`)
        .send(newObject)
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            itineraryName: expect.any(String),
            itineraryDescription: expect.any(String),
            idTour: expect.any(String),
            stringLocation: expect.any(Object),
            details: expect.any(Array),
          }))
          expect(body).toHaveProperty('idTour', idTour)
          expect(body).toHaveProperty('itineraryName', itineraryName)
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should NOT POST a itinerary that incomplete fields', (done) => {
      const itineraryTwo = {
        changeNameItinerary
      }
      request(server)
        .post(`${url}/itineraries`)
        .set('Authorization', `Bearer ${token}`)
        .send(itineraryTwo)
        .expect(422)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(errors.msg).toBeInstanceOf(Array)
          done()
        })
    })
    test('it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .post(`${url}/itineraries`)
          .send(newObject)
          .expect(401)
          .end((err, res) => {
            done()
          })
      }
    )
  })

  describe('/GET/:id itineraries', () => {
    test('it should GET a itinerary by the given id', (done) => {
      request(server)
        .get(`${url}/itineraries/${idItinerary}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            itineraryName: expect.any(String),
            itineraryDescription: expect.any(String),
            idTour: expect.any(String),
          }))
          expect(body).toHaveProperty('idTour', idTour)
          expect(body).toHaveProperty('_id', idItinerary)
          done()
        })
    })
    test('it should GET a itinerary by the given id rute admin', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/itineraries/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            itineraryName: expect.any(String),
            itineraryDescription: expect.any(String),
            idTour: expect.any(String),
          }))
          expect(body).toHaveProperty('idTour', idTour)
          expect(body).toHaveProperty('itineraryName', itineraryName)
          expect(body).toHaveProperty('_id', id)
          expect(body.details).toHaveLength(2)
          done()
        })
    })
    test(
      'it should NOT be able to consume the route since no token was sent rute admin',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/itineraries/${id}`)
          .expect(401)
          .end((err, res) => {
            done()
          })
      }
    )
  })
  describe('/PATCH/:id itineraries', () => {
    test('it should UPDATE a itinerary given the id', (done) => {
      const id = createdID.slice(-1).pop()
      const newDescription = faker.random.words()
      const newTitle = faker.random.words()
      request(server)
        .patch(`${url}/itineraries/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          itineraryName: newTitle,
          itineraryDescription: newDescription
        })
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            itineraryName: expect.any(String),
            itineraryDescription: expect.any(String),
            idTour: expect.any(String),
          }))
          expect(body).toHaveProperty('itineraryDescription', newDescription)
          expect(body).toHaveProperty('itineraryName', newTitle)
          expect(body).toHaveProperty('_id', id)
          done()
        })
    })
  })
  it(
    'it should NOT be able to consume the route since no token was sent',
    (done) => {
      const id = createdID.slice(-1).pop()
      const newDescription = faker.random.words()
      const newTitle = faker.random.words()
      request(server)
        .patch(`${url}/itineraries/${id}`)
        .send({
          itineraryName: newTitle,
          itineraryDescription: newDescription
        })
        .expect(401)
        .end((err, res) => {
          done()
        })
    }
  )
})

describe('/DELETE/:id itineraries', () => {
  test('it should DELETE a itinerary given the id', (done) => {
    const id = createdID.slice(-1).pop()
    request(server)
      .delete(`${url}/itineraries/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((error, result) => {
        const { body: newBody } = result
        expect(newBody).toBeInstanceOf(Object)
        expect(newBody).toMatchObject({ msg: 'DELETED' })
        done()
      })
  })
})

afterAll(() => {
  createdID.forEach((id) => {
    itinerary.findByIdAndRemove(id, (err) => {
      if (err) {
        // console.log(err)
      }
    })
  })
})
