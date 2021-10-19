/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'

const faker = require('faker')


const conversation = require('../../app/models/conversation')
const server = require('../../superTest')
const request = require('supertest')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
const createdID = []
/** message */

const toUser2 = '5fa29a9584b39b13786fbfc2'

const url = process.env.URL_TEST_ADMIN



describe('*********** CONVERSATIONS_ADMIN ***********', () => {
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

  describe('/DELETE/:id conversation', () => {
    test('it should DELETE a conversation given the id', (done) => {
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
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body).toEqual(expect.objectContaining({
            _id: expect.any(String),
            hash: expect.any(String),
            messages: expect.any(Array),
          }))
          request(server)
            .delete(`${url}/conversations/${res.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((error, result) => {
              const { body } = result
              expect(body).toBeInstanceOf(Object)
              expect(body).toHaveProperty('msg', 'DELETED')
              done()
            })
        })
    })
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
