/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')
const support = require('../../app/models/supportTicket')
const request = require('supertest')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
/** message */
let id

const hash = 'YPp_bWfeEWQV'

const url = process.env.URL_TEST_ADMIN

module.exports = (server) => {
  describe('*********** SUPPORT_ADMIN ***********', () => {
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
    describe('/GET support', () => {
      test('it should NOT be able to consume the route since no token was sent',
        (done) => {
          request(server)
            .post(`${url}/support`)
            .expect(401)
            .end((err, res) => {
              done()
            })
        }
      )
      test('it should GET all the support', (done) => {
        request(server)
          .get(`${url}/support`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toEqual(expect.objectContaining({
              totalDocs: expect.any(Number),
              docs: expect.any(Array),
            }))
            expect(body).toHaveProperty('totalDocs', 1)
            const { docs } = body
            const firstChat = _.head(docs)
            expect(firstChat).toEqual(expect.objectContaining({
              _id: expect.any(String),
              status: expect.any(String),
            }))
            id = firstChat._id
            expect(firstChat).toHaveProperty('hash', hash)
            done()
          })
      })
      test('it should GET item by id', (done) => {
        request(server)
          .get(`${url}/support/${id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              status: expect.any(String),
              hash: expect.any(String),
              messages: expect.any(Array),
            }))
            expect(body).toHaveProperty('_id', id)
            expect(body).toHaveProperty('hash', hash)
            done()
          })
      })
    })
    describe('/POST To new support', () => {
      test('error in params', (done) => {
        const messagePost = {
          message: faker.random.words()
        }
        request(server)
          .post(`${url}/support`)
          .set('Authorization', `Bearer ${token}`)
          .send(messagePost)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            done()
          })
      })
      test('it should POST to without hash', (done) => {
        const messagePost = {
          message: faker.random.words(),
          id
        }
        request(server)
          .post(`${url}/support`)
          .set('Authorization', `Bearer ${token}`)
          .send(messagePost)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              hash: expect.any(String),
            }))
            expect(body.messages).toHaveLength(2)
            const lastMessage = _.last(body.messages)
            expect(lastMessage).toHaveProperty('message', messagePost.message)
            createdID.push(res.body._id)
            done()
          })
      })
    })

    afterAll(() => {
      createdID.forEach((idSupport) => {
        support.findByIdAndRemove(idSupport, (err) => {
          if (err) {
            // console.log(err)
          }
        })
      })
    })
  })
}

