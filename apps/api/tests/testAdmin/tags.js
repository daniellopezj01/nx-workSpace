/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const faker = require('faker')

const _ = require('lodash')
const tag = require('../../app/models/tags')
const server = require('../../superTest')
const request = require('supertest')
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
  describe('/GET tags', () => {
    test('it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/tags`)
          .expect(401)
          .end((err, res) => {
            done()
          })
      }
    )
    test('it should GET all the tags', (done) => {
      request(server)
        .get(`${url}/tags`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            docs: expect.any(Array)
          }))
          done()
        })
    })
    test('it should GET the tags with filters', (done) => {
      request(server)
        .get(`${url}/tags?filter=tren&fields=name`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            docs: expect.any(Array)
          }))
          expect(body.docs).toHaveLength(1)
          const firstTag = _.head(body.docs)
          expect(firstTag).toHaveProperty('name', 'tren')
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
    test('it should POST a tag ', (done) => {
      const tagPostTwo = {
        name
      }
      request(server)
        .post(`${url}/tags`)
        .set('Authorization', `Bearer ${token}`)
        .send(tagPostTwo)
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
          }))
          expect(body).toHaveProperty('name', name)

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
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
          }))
          expect(body).toHaveProperty('_id', id)
          done()
        })
    })
    test(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .get(`${url}/tags/${id}`)
          .expect(401)
          .end((err, res) => {
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
        .expect(200)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('_id', id)
          expect(body).toHaveProperty('name', newtag)
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
        .expect(422)
        .end((error, res) => {
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          done()
        })
    })
    test(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        const id = createdID.slice(-1).pop()
        request(server)
          .patch(`${url}/tags/${id}`)
          .expect(401)
          .send({
            name: newtag
          })
          .end((err, res) => {
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
        .expect(201)
        .end((err, res) => {
          const { body } = res
          expect(body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
          }))
          request(server)
            .delete(`${url}/tags/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((error, result) => {
              const { body: newBody } = result
              expect(newBody).toBeInstanceOf(Object)
              expect(newBody).toHaveProperty('msg', 'DELETED')
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
