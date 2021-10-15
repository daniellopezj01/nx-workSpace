/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */

process.env.NODE_ENV = 'test'
const _ = require('lodash')
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

const contractData = {
  id: '5fa1831e02945b26c4561774',
  payAmount: 100,
  intent: 'buyTour'
}



describe('*********** CONTRACTS_USER ***********', () => {
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

  describe('/POST contracts', () => {
    test('it should NOT POST a contract without contracts', (done) => {
      const contractOne = {}
      request(server)
        .post(`${url}/contracts`)
        .set('Authorization', `Bearer ${token}`)
        .send(contractOne)
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
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
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('percentage').toEqual(contractData.payAmount)
          expect(body).have.property('idOperation').toEqual(contractData.id)
          done()
        })
    })
    test('it should POST a contracts other percentage', (done) => {
      contractData.payAmount = 10
      request(server)
        .post(`${url}/contracts`)
        .set('Authorization', `Bearer ${token}`)
        .send(contractData)
        .end((err, res) => {
          expect(res).have.status(200)
          const { body } = res
          expect(body).toBeInstanceOf(Object)
          expect(body).have.property('percentage').toEqual(contractData.payAmount)
          expect(body).have.property('idOperation').toEqual(contractData.id)
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
        .end((err, res) => {
          const { body } = res
          expect(res).have.status(422)
          expect(body).toBeInstanceOf(Object)
          expect(body).toHaveProperty('errors')
          const { msg } = body.errors
          expect(msg).toBeInstanceOf(Array)
          expect(msg).toHaveLength(2)
          const first = _.head(msg)
          expect(first).toEqual(expect.arrayContaining(['msg', 'param', 'location']))
          done()
        })
    })
  })
})
