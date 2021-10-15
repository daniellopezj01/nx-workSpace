/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')
const chai = require('chai')
const chaiHttp = require('chai-http')
const tag = require('../../app/models/tags')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
const name = faker.random.words()
const newtag = faker.random.words()
const url = process.env.URL_TEST_ADMIN


describe('*********** TAGS_ADMIN ***********', () => {
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

  describe('/GET tags', () => {
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/tags`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
    test('it should GET all the tags', (done) => {
      request(server)
        .get(`${url}/tags`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(Array.isArray(res.body.docs)).toBe(true)
          done()
        })
    })
    test('it should GET the tags with filters', (done) => {
      request(server)
        .get(`${url}/tags?filter=tren&fields=name`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).have.status(200)
          expect(res.body).toBeInstanceOf(Object)
          expect(Array.isArray(res.body.docs)).toBe(true)
          expect(res.body.docs).toHaveLength(1)
          expect(res.body.docs[0]).have.property('name').toBe('tren')
          done()
        })
    })
  })

  describe('/POST tags', () => {
    test('it should NOT POST a tag without tag', (done) => {
      const tagPostOne = {}
      request(server)
        .post(`${url}/tags`)
        .set('Authorization', `Bearer ${token}`)
        .send(tagPostOne)
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
    test('it should POST a tag ', (done) => {
      const tagPostTwo = {
        name
      }
      request(server)
        .post(`${url}/tags`)
        .set('Authorization', `Bearer ${token}`)
        .send(tagPostTwo)
        .end((err, res) => {
          expect(res).have.status(201)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['_id', 'name']))
          expect(body).have.property('name').toEqual(name)
          expect(typeof body).toBe('string')
          createdID.push(res.body._id)
          done()
        })
    })
  })

  describe('/GET/:id tags', () => {
    test('it should GET a tags by the given id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .get(`${url}/tags/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.arrayContaining(['name', '_id']))
          expect(body).have.property('_id').toEqual(id)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/tags/${id}`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/PATCH/:id tags', () => {
    test('it should UPDATE a tag given the id', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .patch(`${url}/tags/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: newtag
        })
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(200)
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('_id').toEqual(id)
          expect(body).have.property('name').toEqual(newtag)
          expect(typeof body._id).toBe('string')
          createdID.push(res.body._id)
          done()
        })
    })
    test('it should not UPDATE a tags empty', (done) => {
      const id = createdID.slice(-1).pop()
      request(server)
        .patch(`${url}/tags/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .end((error, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/tags/${id}`)
          .send({
            name: newtag
          })
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })

  describe('/DELETE/:id tag', () => {
    test('it should DELETE a tag given the id', (done) => {
      const tagdelete = {
        name: faker.random.words()
      }
      request(server)
        .post(`${url}/tags`)
        .set('Authorization', `Bearer ${token}`)
        .send(tagdelete)
        .end((err, res) => {
          expect(res).have.status(201)
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.arrayContaining(['_id', 'name']))
          chai
            .request(server)
            .delete(`${url}/tags/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .end((error, result) => {
              const { body } = result
              expect(result).have.status(200)
              expect(body).toBeInstanceOf(Object)
              expect(body).have.property('msg').toBe('DELETED')
              done()
            })
        })
    })
  })

  afterAll(() => {
    createdID.forEach((id) => {
      tag.findByIdAndRemove(id, (err) => {
        if (err) {
          // console.log(err)
        }
      })
    })
  })
})
