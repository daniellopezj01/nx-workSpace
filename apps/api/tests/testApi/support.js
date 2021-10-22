/* eslint-disable no-undef */
/* eslint-disable handle-callback-err */
process.env.NODE_ENV = 'test'

const _ = require('lodash')
const faker = require('faker')


const support = require('../../app/models/supportTicket')
const request = require('supertest')
// eslint-disable-next-line no-unused-vars
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const createdID = []
/** message */

const codeReservation = '665-446'
const hash = 'YPp_bWfeEWQV'

const url = process.env.URL_TEST_USER


module.exports = (server) => {
  describe('*********** SUPPORT_USERS ***********', () => {
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
    describe('/GET support', () => {
      test(
        'it should NOT be able to consume the route since no token was sent',
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
          .get(`${url}/support/${codeReservation}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body.docs).toBeInstanceOf(Array)
            expect(body.totalDocs).toEqual(1)
            const { docs } = body
            const firstChat = _.head(docs)
            expect(firstChat).toEqual(expect.objectContaining({
              _id: expect.any(String),
              status: expect.any(String),
              hash: expect.any(String),
              firstMessage: expect.any(Object),
            }))
            expect(firstChat.hash).toEqual(hash)
            expect(firstChat.codeReservation).toEqual(codeReservation)
            done()
          })
      })
      test('it should not  GET support by codeReservation', (done) => {
        request(server)
          .get(`${url}/support/6035014000c0712dcc000368`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('docs')
            const { docs } = body
            expect(docs).toHaveLength(0)
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
      // test('it should POST to without hash', (done) => {
      //   const messagePost = {
      //     message: faker.random.words(),
      //     codeReservation
      //   }
      //   chai
      //     .request(server)
      //     .post(`${url}/support`)
      //     .set('Authorization', `Bearer ${token}`)
      //     .send(messagePost)
      //     .end((err, res) => {
      //       const { body } = res
      //       res.should.have.status(200)
      //       body.should.be.a('object')
      //       body.should.include.keys('_id', 'hash')
      //       body._id.should.be.a('string')
      //       body.hash.should.be.a('string')
      //       body.codeReservation.should.be.a('string').eql(codeReservation)
      //       body.messages.should.be.a('array').length(1)
      //       const lastMessage = _.last(body.messages)
      //       lastMessage.should.have.property('message').eql(messagePost.message)
      //       createdID.push(res.body._id)
      //       done()
      //     })
      // })
      test('it should POST to with hash', (done) => {
        const messagePost = {
          message: faker.random.words(),
          codeReservation,
          hash
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
              status: expect.any(String),
              hash: expect.any(String),
            }))
            // expect(body).toEqual(expect.arrayContaining(['_id', 'hash']))
            expect(body).toHaveProperty('hash', hash)
            expect(body.codeReservation).toEqual(codeReservation)
            const lastMessage = _.last(body.messages)
            expect(lastMessage).toHaveProperty('message', messagePost.message)
            createdID.push(res.body._id)
            done()
          })
      })
      test('new support', (done) => {
        const messagePost = {
          message: faker.random.words(),
          codeReservation
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
              status: expect.any(String),
              hash: expect.any(String),
            }))
            expect(body.messages).toBeInstanceOf(Array)
            const lastMessage = _.last(body.messages)
            expect(lastMessage).toHaveProperty('message', messagePost.message)
            expect(body).toHaveProperty('codeReservation', codeReservation)
            createdID.push(res.body._id)
            done()
          })
      })
    })

    describe('/GET/: support currentChat', () => {
      const object = {
        codeReservation,
        hash
      }
      test('it should GET support by hash', (done) => {
        request(server)
          .post(`${url}/support/currentChat`)
          .set('Authorization', `Bearer ${token}`)
          .send(object)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              _id: expect.any(String),
              status: expect.any(String),
              hash: expect.any(String),
            }))
            expect(body).toHaveProperty('hash', hash)
            // body.messages.should.be.a('array').length(2)
            expect(body.codeReservation).toEqual(codeReservation)
            createdID.push(res.body._id)
            done()
          })
      })
    })

    afterAll(() => {
      createdID.forEach((id) => {
        support.findByIdAndRemove(id, (err) => {
          if (err) {
            // console.log(err)
          }
        })
      })
    })
  })
}