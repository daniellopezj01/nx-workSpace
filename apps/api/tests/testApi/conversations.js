/* eslint-disable max-statements */
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')


const conversation = require('../../app/models/conversation')
const request = require('supertest')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const createdID = []
/** message */

const existHash = '0Je0su8WqkndG_Qe2foaz'
const toUser1 = '5aa1c2c35ef7a4e97b5e995b'
const toUser2 = '5fa29a9584b39b13786fbfc2'

const url = process.env.URL_TEST_USER



module.exports = (server) => {
  describe('*********** CONVERSATIONS_USER ***********', () => {
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
      }, 1000)
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
    describe('/GET conversations', () => {
      test('it should NOT be able to consume the route since no token was sent',
        (done) => {
          request(server)
            .get(`${url}/conversations`)
            .expect(401)
            .end((err, res) => {
              done()
            })
        }, 1000)
      test('it should GET all the conversations', (done) => {
        request(server)
          .get(`${url}/conversations`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            // res.body.should.have.lengthOf(1)
            expect(body).toEqual(expect.objectContaining({
              limit: expect.any(Number),
              page: expect.any(Number),
              totalPages: expect.any(Number),
              totalDocs: expect.any(Number),
              docs: expect.any(Array),
            }))
            const { docs } = body
            const firstChat = _.head(docs)
            expect(firstChat).toEqual(expect.objectContaining({
              _id: expect.any(String),
              hash: expect.any(String),
              messages: expect.any(Array),
              firstMessage: expect.any(Object),
              members: expect.any(Array),
              toFrom: expect.any(Object),
            }))
            done()
          })
      }, 1000)
      test('it should not  GET conversations by hash', (done) => {
        request(server)
          .get(`${url}/conversations/noexiste`)
          .set('Authorization', `Bearer ${token}`)
          .expect(422)
          .end((err, res) => {
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body).toHaveProperty('errors', { msg: 'NOT_FOUND' })
            done()
          })
      }, 1000)
    })

    describe('/POST To new Conversation', () => {
      test('error in params', (done) => {
        const messagePost = {
          message: faker.random.words()
        }
        request(server)
          .post(`${url}/messages/false`)
          .set('Authorization', `Bearer ${token}`)
          .send(messagePost)
          .expect(422)
          .end((err, res) => {
            expect(res.body).toBeInstanceOf(Object)
            // res.body.should.include.property('errors').eql({ msg: 'BODY_INCOMPLETE' })
            createdID.push(res.body.idConversation)
            done()
          })
      }, 1000)
      test('it should POST to with hash', (done) => {
        const messagePost = {
          message: faker.random.words(),
          to: toUser1
        }
        request(server)
          .post(`${url}/messages/${existHash}`)
          .set('Authorization', `Bearer ${token}`)
          .send(messagePost)
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              hash: expect.any(String),
              updatedAt: expect.any(String),
              messages: expect.any(Array),
              members: expect.any(Array),
            }))
            expect(body).toHaveProperty('hash', existHash)
            const lastMessage = _.last(body.messages)
            expect(lastMessage).toHaveProperty('message', messagePost.message)
            createdID.push(res.body._id)
            done()
          })
      }, 1000)
      test('new Conversation', (done) => {
        const messagePost = {
          message: faker.random.words(),
          to: toUser2
        }
        request(server)
          .post(`${url}/messages`)
          .set('Authorization', `Bearer ${token}`)
          .send(messagePost)
          .expect(201)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              hash: expect.any(String),
              type: expect.any(String),
              members: expect.any(Array),
            }))
            createdID.push(res.body._id)
            done()
          })
      }, 1000)
    })

    describe('/GET/:id conversations', () => {
      test('it should GET conversations by hash', (done) => {
        request(server)
          .get(`${url}/conversations/${existHash}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              hash: expect.any(String),
              type: expect.any(String),
              members: expect.any(Array),
            }))
            expect(body).toHaveProperty('hash', existHash)
            expect(Array.isArray(body.messages)).toBe(true)
            done()
          })
      }, 1000)
    })

    afterAll(() => {
      createdID.forEach((id) => {
        conversation.findByIdAndRemove(id, (err) => {
          if (err) {
            // console.log(err)
          }
        })
      })
    })
  })
}