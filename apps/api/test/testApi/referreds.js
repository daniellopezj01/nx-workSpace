/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test'

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

chai.use(chaiHttp)

describe('*********** REFERREDS_USERS ***********', () => {
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

  describe('/GET referreds', () => {
    it('it should GET all the referreds', (done) => {
      chai
        .request(server)
        .get(`${url}/referreds`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          const { body } = res
          res.should.have.status(200)
          const {
            docs,
            totalDocs,
            hasPrevPage,
            hasNextPage
          } = body
          body.should.be.an('object')
          docs.should.be.a('array')
          docs.should.have.length(2)
          hasNextPage.should.be.a('boolean')
          hasPrevPage.should.be.a('boolean')
          body.limit.should.be.a('number')
          body.page.should.be.a('number')
          totalDocs.should.be.a('number')
          body.totalPages.should.be.a('number')
          done()
        })
    })
    it('it should NOT be able to consume the route since no token was sent', (done) => {
      chai
        .request(server)
        .get(`${url}/referreds`)
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
})
