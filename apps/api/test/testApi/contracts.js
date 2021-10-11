/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */

process.env.NODE_ENV = 'test'
const _ = require('lodash')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')
// eslint-disable-next-line no-unused-vars
const should = chai.should()
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

chai.use(chaiHttp)

describe('*********** CONTRACTS_USER ***********', () => {
  describe('/POST login', () => {
    it('it should GET token user', (done) => {
      chai
        .request(server)
        .post(`${url}/login`)
        .send(loginDetails)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.include.keys('accessToken', 'user')
          const currentAccessToken = res.body.accessToken
          accessToken = currentAccessToken
          done()
        })
    })
    it('it should GET a fresh token', (done) => {
      chai
        .request(server)
        .post(`${url}/exchange`)
        .send({
          accessToken
        })
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          body.should.be.an('object')
          body.should.include.keys('token', 'user')
          const currentToken = body.token
          token = currentToken
          done()
        })
    })
  })

  describe('/POST contracts', () => {
    it('it should NOT POST a contract without contracts', (done) => {
      const contractOne = {}
      chai
        .request(server)
        .post(`${url}/contracts`)
        .set('Authorization', `Bearer ${token}`)
        .send(contractOne)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          const { msg } = body.errors
          msg.should.be.a('Array')
          done()
        })
    })
    it('it should POST a contracts 100 percentage', (done) => {
      chai
        .request(server)
        .post(`${url}/contracts`)
        .set('Authorization', `Bearer ${token}`)
        .send(contractData)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('percentage').eql(contractData.payAmount)
          body.should.have.property('idOperation').eql(contractData.id)
          done()
        })
    })
    it('it should POST a contracts other percentage', (done) => {
      contractData.payAmount = 10
      chai
        .request(server)
        .post(`${url}/contracts`)
        .set('Authorization', `Bearer ${token}`)
        .send(contractData)
        .end((err, res) => {
          res.should.have.status(200)
          const { body } = res
          body.should.be.a('object')
          body.should.have.property('percentage').eql(contractData.payAmount)
          body.should.have.property('idOperation').eql(contractData.id)
          done()
        })
    })
    it('it should NOT POST a contracts are emply fields', (done) => {
      const contractTwo = {
        id: '5fa1831e02945b26c4561774',
        payAmount: 100
      }
      chai
        .request(server)
        .post(`${url}/contracts/`)
        .set('Authorization', `Bearer ${token}`)
        .send(contractTwo)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(422)
          body.should.be.a('object')
          body.should.have.property('errors')
          const { msg } = body.errors
          msg.should.be.a('Array')
          msg.should.have.length(2)
          const first = _.head(msg)
          first.should.include.keys('msg', 'param', 'location')
          done()
        })
    })
  })
})
