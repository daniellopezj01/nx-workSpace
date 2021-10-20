/* eslint-disable no-undef */
/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'


const _ = require('lodash')

const Tour = require('../../app/models/tour')
const server = require('../../server')

const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const createdID = []

const url = process.env.URL_TEST_USER



describe('*********** TOURS_USERS ***********', () => {
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
          _.map(docs, (a, i) => {
            expect(docs[i].category).be.a('array').toHaveLength(1)
            expect(docs[i]).toEqual(expect.arrayContaining(['title', 'slug', 'route']))
          })
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
    test('it should GET the tours with query,Empty', (done) => {
      request(server)
        .get(`${url}/tours?query=zzzzzzzzzz`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(Array.isArray(body.docs)).toBe(true)
          expect(body.docs).toHaveLength(0)
          done()
        })
    })
    test('it should GET the tours with query', (done) => {
      request(server)
        .get(`${url}/tours?query=medellin`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(Array.isArray(body.docs)).toBe(true)
          expect(body.docs).toHaveLength(1)
          done()
        })
    })
    test('it should GET number tours for continents', (done) => {
      request(server)
        .get(`${url}/tours/forContinents`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Array)
          _.map(res.body, (a, i) => {
            expect(body[i]).toBeInstanceOf(Number)
            expect(body[i]).have.property('count').toBeGreaterThan(0)
          })
          done()
        })
    })
    test('it should GET departures tours', (done) => {
      request(server)
        .get(`${url}/tours/departures/tour-one`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('departures')
          expect(body).toBeInstanceOf(Array)
          expect(body).have.property('status').toBe('publish')
          expect(body).have.property('slug').toBe('tour-one')
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
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(404)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('errors').toEqual({ msg: 'Params Error' })
          done()
        })
    })
    test('search with params', (done) => {
      request(server)
        .get(`${url}/tours/search?query=MedeLLIN`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('tours')
          expect(body).toHaveProperty('places')
          expect(body.tours).toHaveLength(1)
          expect(body.tours[0]).have.property('title').toBe('tour one')
          done()
        })
    })
    test('empty search', (done) => {
      request(server)
        .get(`${url}/tours/search?query=zzzzzzzzzzzzzzzzzz`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
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
