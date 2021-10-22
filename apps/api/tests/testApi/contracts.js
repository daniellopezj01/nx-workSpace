/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'
const _ = require('lodash')


const loginDetails = {
  email: 'admin@admin.com',
  password: '12345678'
}
let token = ''
let accessToken = ''

const url = process.env.URL_TEST_USER
const request = require('supertest')
const contractData = {
  id: '5fa1831e02945b26c4561774',
  payAmount: 100,
  intent: 'buyTour'
}

module.exports = (server) => {
  describe('*********** CONTRACTS_USER ***********', () => {
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

    describe('/POST contracts', () => {
      test('it should NOT POST a contract without contracts', (done) => {
        const contractOne = {}
        request(server)
          .post(`${url}/contracts`)
          .set('Authorization', `Bearer ${token}`)
          .send(contractOne)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            const { msg } = body.errors
            expect(msg).toBeInstanceOf(Array)
            done()
          })
      })
      test('it should POST a contracts 100 percentage', (done) => {
        request(server)
          .post(`${url}/contracts`)
          .set('Authorization', `Bearer ${token}`)
          .send(contractData)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('percentage', contractData.payAmount)
            expect(body).toHaveProperty('idOperation', contractData.id)
            done()
          })
      })
      test('it should POST a contracts other percentage', (done) => {
        contractData.payAmount = 10
        request(server)
          .post(`${url}/contracts`)
          .set('Authorization', `Bearer ${token}`)
          .send(contractData)
          .expect(200)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('percentage', contractData.payAmount)
            expect(body).toHaveProperty('idOperation', contractData.id)
            done()
          })
      })
      test('it should NOT POST a contracts are emply fields', (done) => {
        const contractTwo = {
          id: '5fa1831e02945b26c4561774',
          payAmount: 100
        }
        request(server)
          .post(`${url}/contracts/`)
          .set('Authorization', `Bearer ${token}`)
          .send(contractTwo)
          .expect(422)
          .end((err, res) => {
            const { body } = res
            expect(body).toBeInstanceOf(Object)
            expect(body).toHaveProperty('errors')
            const { msg } = body.errors
            expect(msg).toBeInstanceOf(Array)
            expect(msg).toHaveLength(2)
            const first = _.head(msg)
            expect(first).toEqual(expect.objectContaining({
              msg: expect.any(String),
              param: expect.any(String),
              location: expect.any(String),
            }))
            done()
          })
      })
    })
  })
}