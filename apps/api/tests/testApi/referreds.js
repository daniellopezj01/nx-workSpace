/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''
const url = process.env.URL_TEST_USER



describe('*********** REFERREDS_USERS ***********', () => {
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

  describe('/GET referreds', () => {
    test('it should GET all the referreds', (done) => {
      request(server)
        .get(`${url}/referreds`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(200)
          const { docs, totalDocs, hasPrevPage, hasNextPage } = body
          expect(body).toBeInstanceOf(Object)
          expect(Array.isArray(docs)).toBe(true)
          expect(docs).toHaveLength(2)
          expect(hasNextPage).toBeInstanceOf(Boolean)
          expect(hasPrevPage).toBeInstanceOf(Boolean)
          expect(body.limit).toBeInstanceOf(Number)
          expect(body.page).toBeInstanceOf(Number)
          expect(totalDocs).toBeInstanceOf(Number)
          expect(body.totalPages).toBeInstanceOf(Number)
          done()
        })
    })
    it(
      'it should NOT be able to consume the route since no token was sent',
      (done) => {
        request(server)
          .get(`${url}/referreds`)
          .end((err, res) => {
            expect(res).have.status(401)
            done()
          })
      }
    )
  })
})
