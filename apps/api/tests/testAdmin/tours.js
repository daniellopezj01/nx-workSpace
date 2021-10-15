/* eslint-disable no-undef */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const Tour = require('../../app/models/tour')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
const title = 'bogota'
const subTitle = faker.random.words()
const description = faker.random.words()
const route = faker.random.words()
const newtour = faker.random.words()

const url = process.env.URL_TEST_ADMIN


describe('*********** TOURS_ADMIN ***********', () => {
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

  describe('/GET tours', () => {
    test('it should GET all the tours', (done) => {
      request(server)
        .get(`${url}/tours`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          const { docs, totalDocs } = body
          expect(body).toBeInstanceOf(Object)
          expect(body.hasNextPage).toBeInstanceOf(Boolean)
          expect(body.hasPrevPage).toBeInstanceOf(Boolean)
          expect(body.limit).toBeInstanceOf(Number)
          expect(body.page).toBeInstanceOf(Number)
          expect(body.pagingCounter).toBeInstanceOf(Number)
          expect(body.totalPages).toBeInstanceOf(Number)
          expect(totalDocs).be.a('number').toBe(2)
          expect(Array.isArray(docs)).toBe(true)
          expect(docs).toHaveLength(2)
          done()
        })
    })
    test('it should GET the tours with limit', (done) => {
      request(server)
        .get(`${url}/tours?limit=1`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(Array.isArray(body.docs)).toBe(true)
          expect(body.docs).toHaveLength(1)
          done()
        })
    })
    test('it should GET the tours with slug', (done) => {
      request(server)
        .get(`${url}/tours/tour-one`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'countries', 'departures', 'itinerary']))
          expect(body).have.property('slug').toBe('tour-one')
          expect(body).have.property('status').toBe('publish')
          expect(body).toHaveProperty('departures').be.a('array').toHaveLength(1)
          expect(body).toHaveProperty('itinerary').be.a('array').toHaveLength(2)
          done()
        })
    })
    test('it should GET number tours all continents', (done) => {
      request(server)
        .get(`${url}/tours/allContinents`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body.docs).be.an('Array').toHaveLength(5)
          done()
        })
    })
  })

  describe('/GET/:id tour', () => {
    test('it should GET a tour by the given id', (done) => {
      request(server)
        .get(`${url}/tours/5fa181b202945b26c456176a`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('title')
          expect(body).have.property('_id').toBe('5fa181b202945b26c456176a')
          done()
        })
    })
    test('it should GET a tour by the given slug', (done) => {
      request(server)
        .get(`${url}/tours/tour-one`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('title')
          expect(body).have.property('slug').toBe('tour-one')
          done()
        })
    })
  })

  describe('/POST tour', () => {
    test('it should NOT POST a tour without tour', (done) => {
      const tour = {}
      request(server)
        .post(`${url}/tours`)
        .set('Authorization', `Bearer ${token}`)
        .send(tour)
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty('errors')
          done()
        })
    })
    test('it should POST a tour ', (done) => {
      const tour = {
        title,
        subTitle,
        description,
        countries: faker.random.number(),
        cities: faker.random.number(),
        duration: faker.random.number(),
        route,
        video: 'https://hello.io'
      }
      request(server)
        .post(`${url}/tours`)
        .set('Authorization', `Bearer ${token}`)
        .send(tour)
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining('_id'))
          expect(res.body).have.property('title').toEqual(title)
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should NOT POST a tour that already exists', (done) => {
      const tour = {
        title
      }
      request(server)
        .post(`${url}/tours`)
        .set('Authorization', `Bearer ${token}`)
        .send(tour)
        .end((err, res) => {
          expect(res).have.status(422)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toHaveProperty('errors')
          done()
        })
    })
  })

  describe('/PATCH/:id tour', () => {
    test('it should UPDATE a tour given the id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .patch(`${url}/tours/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: newtour,
          subTitle: faker.random.words(),
          description: faker.random.words(),
          route: faker.random.words(),
          video: 'https://hello.io'
        })
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).have.property('title').toEqual(newtour)
          createdID.push(res.body._id)
          done()
        })
    })
    test('it NOT should UPDATE a tour unauthorized', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .patch(`${url}/tours/${id}`)
        .send({
          title: newtour
        })
        .end((error, res) => {
          expect(res).have.status(401)
          expect(res.body).toBeInstanceOf(Object)
          done()
        })
    })
  })

  describe('/DELETE/:id tour', () => {
    test('it should DELETE a tour given the id', (done) => {
      const tour = {
        title: faker.random.words(),
        subTitle,
        description,
        countries: faker.random.number(),
        cities: faker.random.number(),
        duration: faker.random.number(),
        route,
        video: 'https://hello.io'
      }
      request(server)
        .post(`${url}/tours`)
        .set('Authorization', `Bearer ${token}`)
        .send(tour)
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(
            expect.arrayContaining(['_id', 'title', 'subTitle', 'description', 'route'])
          )
          chai
            .request(server)
            .delete(`${url}/tours/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, result) => {
              expect(result).have.status(200)
              expect(result.body).toBeInstanceOf(Object)
              expect(result.body).have.property('msg').toBe('DELETED')
              done()
            })
        })
    })
  })

  afterAll(() => {
    createdID.forEach((id) => {
      Tour.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
