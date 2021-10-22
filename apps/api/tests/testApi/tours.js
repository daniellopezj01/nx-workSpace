/* eslint-disable no-undef */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'


const _ = require('lodash')

const Tour = require('../../app/models/tour')
const request = require('supertest')

const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const createdID = []

const url = process.env.URL_TEST_USER



module.exports = (server) => {
  describe('*********** TOURS_USERS ***********', () => {
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
            _.map(docs, (a, i) => {
              expect(docs[i].category).toHaveLength(1)
              expect(docs[i]).toEqual(expect.objectContaining({
                title: expect.any(String),
                slug: expect.any(String),
                route: expect.any(String),
              }))
            })
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
      test('it should GET the tours with query,Empty', (done) => {
        request(server)
          .get(`${url}/tours?query=zzzzzzzzzz`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              docs: expect.any(Array)
            }))
            expect(body.docs).toHaveLength(0)
            done()
          })
      })
      test('it should GET the tours with query', (done) => {
        request(server)
          .get(`${url}/tours?query=medellin`)
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
      test('it should GET number tours for continents', (done) => {
        request(server)
          .get(`${url}/tours/forContinents`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Array)
            _.map(res.body, (a, i) => {
              expect(body[i]).toHaveProperty('count')
              expect(body[i].count).toBeGreaterThan(0)
            })
            done()
          })
      })
      test('it should GET departures tours', (done) => {
        request(server)
          .get(`${url}/tours/departures/tour-one`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('departures')
            expect(body).toHaveProperty('status', 'publish')
            expect(body).toHaveProperty('slug', 'tour-one')
            expect(body.departures).toHaveLength(1)
            done()
          })
      })
    })

    describe('*********** SEARCH TOURS ******************', () => {
      test('with out params', (done) => {
        request(server)
          .get(`${url}/tours/search`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors', { msg: 'Params Error' })
            done()
          })
      })
      test('search with params', (done) => {
        request(server)
          .get(`${url}/tours/search?query=MedeLLIN`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('tours')
            expect(body).toHaveProperty('places')
            expect(body.tours).toHaveLength(1)
            expect(body.tours[0]).toHaveProperty('title', 'tour one')
            done()
          })
      })
      test('empty search', (done) => {
        request(server)
          .get(`${url}/tours/search?query=zzzzzzzzzzzzzzzzzz`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('tours')
            expect(body).toHaveProperty('places')
            expect(body.tours).toHaveLength(0)
            expect(body.places).toHaveLength(0)
            done()
          })
      })
    })

    describe('/GET/:id tour', () => {
      test('it should GET a tour by the given id', (done) => {
        request(server)
          .get(`${url}/tours/5fa181b202945b26c456176a`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((error, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('title')
            expect(body).toHaveProperty('_id', '5fa181b202945b26c456176a')
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
}
