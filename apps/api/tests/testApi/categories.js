/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'
const _ = require('lodash')

const request = require('supertest')
const modalCategory = require('../../app/models/category')
const loginDetails = {
  email: 'user@user.com',
  password: '12345678'
}
const createdID = []

const url = process.env.URL_TEST_USER

module.exports = (server) => {
  describe('*********** CATEGORIES_USER ***********', () => {
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
      }, 1500)
    })

    describe('/GET categories', () => {
      test('it should GET all the categories', (done) => {
        request(server)
          .get(`${url}/categories`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            const { docs } = body
            const category = _.head(docs)
            expect(body).toBeInstanceOf(Object)
            expect(docs).toBeInstanceOf(Array)
            expect(docs).toHaveLength(1)
            expect(category).toEqual(expect.objectContaining({
              _id: expect.any(String),
              name: expect.any(String),
              description: expect.any(String)
            }))
            id = category._id
            done()
          })
      })
      test('it should NOT GET the categories with filters', (done) => {
        request(server)
          .get(`${url}/categories?filter=notExist&fields=name`)
          .expect(200)
          .end((err, res) => {
            expect(res.body).toBeInstanceOf(Object)
            const { body } = res
            const { docs } = body
            expect(body).toEqual(expect.objectContaining({
              totalDocs: expect.any(Number),
              docs: expect.any(Array),
            }))
            expect(docs).toHaveLength(0)
            done()
          })
      })
      test('it should GET the categories with filters', (done) => {
        request(server)
          .get(`${url}/categories?filter=technology&fields=name`)
          .expect(200)
          .end((err, res) => {
            expect(res.body).toBeInstanceOf(Object)
            const { body } = res
            const { docs } = body
            const category = _.head(docs)
            expect(body).toBeInstanceOf(Object)
            expect(docs).toHaveLength(1)
            expect(category).toEqual(expect.objectContaining({
              _id: expect.any(String),
              name: expect.any(String),
              description: expect.any(String)
            }))
            expect(category).toHaveProperty('name', 'technology')
            done()
          })
      })
    })
    afterAll(() => {
      createdID.forEach((idCategory) => {
        modalCategory.findByIdAndRemove(idCategory, (err) => {
          if (err) {
            // console.log(err)
          }
        })
      })
    })
  })
}