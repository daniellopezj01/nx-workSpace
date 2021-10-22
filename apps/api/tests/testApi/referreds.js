/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const request = require('supertest')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const url = process.env.URL_TEST_USER

module.exports = (server) => {
  describe('*********** REFERREDS_USERS ***********', () => {
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

    describe('/GET referreds', () => {
      test('it should GET all the referreds', (done) => {
        request(server)
          .get(`${url}/referreds`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            const { docs } = body
            expect(body).toBeInstanceOf(Object)
            expect(body).toEqual(expect.objectContaining({
              docs: expect.any(Array),
              totalDocs: expect.any(Number),
              hasPrevPage: expect.any(Boolean),
            }))
            expect(docs).toHaveLength(2)
            done()
          })
      })
      test(
        'it should NOT be able to consume the route since no token was sent',
        (done) => {
          request(server)
            .get(`${url}/referreds`)
            .expect(401)
            .end((err, res) => {
              done()
            })
        }
      )
    })
  })
}
