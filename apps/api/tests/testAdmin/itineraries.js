/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'
const _ = require('lodash')
const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const itinerary = require('../../app/models/itinerary')
const server = require('../../server')
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
        .post(`${url}/login`)
        .send(loginDetails)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['accessToken', 'user']))
          const currentAccessToken = res.body.accessToken
          accessToken = currentAccessToken
          done()
        })
    })
    test('it should GET a fresh token', (done) => {
      request(server)
        .post(`${url}/exchange`)
        .send({
          accessToken
        })
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['token', 'user']))
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
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(Array.isArray(body.docs)).toBe(true)
          const firstItinerary = _.head(body.docs)
          idItinerary = firstItinerary._id
          expect(firstItinerary).toEqual(expect.arrayContaining([
            '_id',
            'itineraryName',
            'itineraryDescription',
            'idTour',
            'stringLocation',
            'details'
          ]))
          expect(typeof firstItinerary._id).toBe('string')
          expect(typeof firstItinerary.itineraryName).toBe('string')
          expect(firstItinerary.idTour).be.a('string').toEqual(idTour)
          expect(Array.isArray(firstItinerary.details)).toBe(true)
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
        .end((err, res) => {
          expect(res).have.status(422)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(Array.isArray(errors)).toBe(true)
          done()
        })
    })
    test('it should POST a itineraries ', (done) => {
      request(server)
        .post(`${url}/itineraries`)
        .set('Authorization', `Bearer ${token}`)
        .send(newObject)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(201)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'stringLocation']))
          expect(body).include.property('itineraryName').toEqual(itineraryName)
          expect(typeof body._id).toBe('string')
          expect(typeof body.itineraryName).toBe('string')
          expect(typeof body.itineraryDescription).toBe('string')
          expect(body.idTour).be.a('string').toEqual(idTour)
          expect(body.stringLocation).toBeInstanceOf(Object)
          expect(Array.isArray(body.details)).toBe(true)
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
        .end((err, res) => {
          expect(res).have.status(422)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { errors } = body
          expect(Array.isArray(errors)).toBe(true)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .post(`${url}/itineraries`)
          .send(newObject)
          .end((err, res) => {
            expect(res).have.status(401)
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
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(idItinerary)
          // res.body.should.include.property('itineraryName').eql(itineraryName)
          expect(typeof body._id).toBe('string')
          expect(typeof body.itineraryName).toBe('string')
          expect(typeof body.itineraryDescription).toBe('string')
          expect(body.idTour).be.a('string').toEqual(idTour)
          expect(body.stringLocation).toBeInstanceOf(Object)
          expect(Array.isArray(body.details)).toBe(true)
          done()
        })
    })
    test('it should GET a itinerary by the given id rute admin', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/itineraries/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).include.property('itineraryName').toEqual(itineraryName)
          expect(typeof body._id).toBe('string')
          expect(typeof body.itineraryName).toBe('string')
          expect(typeof body.itineraryDescription).toBe('string')
          expect(typeof body.idTour).toBe('string')
          expect(body.stringLocation).toBeInstanceOf(Object)
          expect(body.details).be.a('array').toHaveLength(2)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent rute admin',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/itineraries/${id}`)
          .end((err, res) => {
            expect(res).have.status(401)
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
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'itineraryDescription', 'itineraryName']))
          expect(typeof body.itineraryName).toBe('string')
          expect(body).have.property('_id').toEqual(id)
          expect(body).have.property('itineraryName').toEqual(newTitle)
          expect(body).have.property('itineraryDescription').toEqual(newDescription)
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
        .end((err, res) => {
          expect(res).have.status(401)
          done()
        })
    }
  )
})

describe('/DELETE/:id itineraries', () => {
  test('it should DELETE a itinerary given the id', (done) => {
    const id = createdID.slice(-1).pop()
    chai
      .request(server)
      .delete(`${url}/itineraries/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .end((error, result) => {
        expect(result).have.status(200)
        expect(result.body).toBeInstanceOf(Object)
        expect(result.body).have.property('msg').toBe('DELETED')
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
