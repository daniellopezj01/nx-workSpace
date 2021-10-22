/* eslint-disable no-undef */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const faker = require('faker')


const Tour = require('../../app/models/tour')
const request = require('supertest')
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
const id = '5fa181b202945b26c456176a'
const url = process.env.URL_TEST_ADMIN

module.exports = (server) => {
  describe('*********** TOURS_ADMIN ***********', () => {
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
      }, 10000)
    })

    describe('/GET tours', () => {
      test('it should GET all the tours', (done) => {
        request(server)
          .get(`${url}/tours`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            const { docs, totalDocs } = body
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              docs: expect.any(Array),
              totalDocs: expect.any(Number),
              hasNextPage: expect.any(Boolean),
              hasPrevPage: expect.any(Boolean),
              limit: expect.any(Number),
              page: expect.any(Number),
              totalPages: expect.any(Number),
            }))
            expect(totalDocs).toEqual(2)
            expect(docs).toHaveLength(2)
            done()
          })
      })
      test('it should GET the tours with limit', (done) => {
        request(server)
          .get(`${url}/tours?limit=1`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              docs: expect.any(Array)
            }))
            expect(body.docs).toHaveLength(1)
            done()
          })
      })
      test('it should GET the tours with slug', (done) => {
        request(server)
          .get(`${url}/tours/tour-one`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              countries: expect.any(Array),
              departures: expect.any(Array),
              itinerary: expect.any(Array),
            }))
            expect(body.departures).toHaveLength(1)
            expect(body.itinerary).toHaveLength(2)
            done()
          })
      })
      test('it should GET number tours all continents', (done) => {
        request(server)
          .get(`${url}/tours/allContinents`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body.docs).toHaveLength(5)
            done()
          })
      })
    })

    describe('/GET/:id tour', () => {
      test('it should GET a tour by the given id', (done) => {
        request(server)
          .get(`${url}/tours/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('title')
            expect(body).toHaveProperty('_id', id)
            done()
          })
      })
      test('it should GET a tour by the given slug', (done) => {
        request(server)
          .get(`${url}/tours/tour-one`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('title')
            expect(body).toHaveProperty('slug', 'tour-one')
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
          .expect(422)
          .send(tour)
          .end((err, res) => {
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
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              countries: expect.any(String),
              continent: expect.any(Array),
              duration: expect.any(Number),
            }))
            expect(body).toHaveProperty('title', title)
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
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            done()
          })
      })
    })

    describe('/PATCH/:id tour', () => {
      test('it should UPDATE a tour given the id', (done) => {
        const currentId = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/tours/${currentId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: newtour,
            subTitle: faker.random.words(),
            description: faker.random.words(),
            route: faker.random.words(),
            video: 'https://hello.io'
          })
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('_id', currentId)
            expect(body).toHaveProperty('title', newtour)
            createdID.push(res.body._id)
            done()
          })
      })
      test('it NOT should UPDATE a tour unauthorized', (done) => {
        const currentId = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/tours/${currentId}`)
          .send({
            title: newtour
          })
          .expect(401)
          .end((error, res) => {
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
          .expect(201)
          .end((err, res) => {
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              title: expect.any(String),
              subTitle: expect.any(String),
              description: expect.any(String),
              route: expect.any(String),
            }))
            request(server)
              .delete(`${url}/tours/${res.body._id}`)
              .set('Authorization', `Bearer ${token}`)
              .expect(200)
              .end((error, result) => {
                expect(result.body).toBeInstanceOf(Object)
                expect(result.body).toHaveProperty('msg', 'DELETED')
                done()
              })
          })
      })
    })

    afterAll(() => {
      createdID.forEach((currentId) => {
        Tour.findByIdAndRemove(currentId, (err) => {
          if (err) {
            // console.log(err)
          }
        })
      })
    })
  })
}
